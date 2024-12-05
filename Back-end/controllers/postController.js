const pool = require('../models/db');
const multer = require('multer');
const fs = require('fs');
const express = require('express');
//this is singup ans dign in pat
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const router = express.Router();
const upload = multer({ dest: 'uploads/' });


// Create a new post with image data
const createPost = async (req, res) => {
  const { description,imageUrl } = req.body;

  if (!description || !imageUrl) {
    return res.status(400).json({ message: 'Description and image are required' });
  }

  try {

    const query = 'INSERT INTO posts (description, imageUrl) VALUES (?, ?)';
    const values = [description, imageUrl];

    const [insertResult] = await pool.query(query, values);
    console.log('insertResult:', insertResult);

    res.status(201).json({ message: 'Post created successfully', postId: insertResult.insertId });
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};



// Retrieve all posts without image data for lightweight response
const getAllPosts = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM posts');

    // Convert image data to base64 if needed (assuming imageUrl is stored as a URL)
    const posts = rows.map((post) => ({
      id: post.id,
      description: post.description,
      imageUrl: post.imageUrl,
      createdAt: post.created_at, // Optional: Adjust based on your table column name
    }));

    res.json(posts); // Send the posts as JSON
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};



// Update a post with a new image
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  const imageUrl =req.body;

  try {
    const [result] = await pool.query(
      'UPDATE posts SET description = ?, imageUrl = ? WHERE id = ?',
      [description, imageUrl, id]
    );

    //if (req.file) fs.unlinkSync(req.file.path);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating post', error });
  }
};



// Delete a post by ID
const deletePostById = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM posts WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting post', error });
  }
};



//singup

// User Registration
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user', error });
  }
};



// User Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user exists
    const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the password with the hashed password in the database
    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user[0].id, email: user[0].email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in', error });
  }
};


//Likes
// each likes by id
const getLikeById = async (req, res) => {
  const { id } = req.params; // Extract post ID from request parameters

  try {
    // Query to fetch the likes count for the specific post by ID
    const [posts] = await pool.query('SELECT id, likes FROM posts WHERE id = ?', [id]);

    // Check if the post with the given ID exists
    if (posts.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Return the post ID and like count
    res.json({
      id: posts[0].id,
      likes: posts[0].likes,
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Error fetching post', error });
  }
};



// The putLikes function that increments the like count
const putLikes = async (req, res) => {
  const postId = req.params.id; // Get post ID from the URL parameter

  // Validate if the postId is a number
  if (isNaN(postId)) {
    return res.status(400).json({ error: 'Invalid post ID' });
  }

  try {
    // Query to update the like count
    const query = 'UPDATE posts SET likes = likes + 1 WHERE id = ?';
    const [result] = await pool.query(query, [postId]);

    // Check if the post with the given ID exists
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ message: 'Like count updated successfully' });
  } catch (error) {
    console.error('Error updating like count:', error);
    res.status(500).json({ error: 'Error updating like count' });
  }
};



//comment CRUD

// Create a new comment

const postcomment = async (req, res) => {
  const { post_id, text } = req.body;
  
  // Log request data to debug
  console.log('Received data:', { post_id, text });
  
  if (!post_id || !text) {
    return res.status(400).json({ message: 'Post ID and text are required' });
  }

  try {
    // Insert comment into the database
    const [result] = await pool.query('INSERT INTO comments (post_id, text) VALUES (?, ?)', [post_id, text]);
    console.log('Comment inserted with ID:', result.insertId);  // Debug log
    res.status(201).json({ id: result.insertId, post_id, text, created_at: new Date() });
  } catch (error) {
    // Log the full error for debugging
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Error creating comment' });
  }
};


// Get comments for a specific post
const getComments = async (req, res) => {
  const { post_id } = req.params;

  console.log('Fetching comments for post_id:', post_id);  // Debug log

  try {
    const [rows] = await pool.query('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC', [post_id]);
    console.log('Fetched comments:', rows);  // Debug log
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
};

// Update a comment for a specific post by post_id and comment_id
const updateComment = async (req, res) => {
  const { post_id, comment_id } = req.params;
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Text is required to update the comment' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE comments SET text = ?, updated_at = NOW() WHERE id = ? AND post_id = ?',
      [text, comment_id, post_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Comment not found or does not belong to the specified post' });
    }

    res.status(200).json({ message: 'Comment updated successfully' });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Error updating comment', error });
  }
};



// Delete a comment for a specific post
const deleteComment = async (req, res) => {
  const { post_id, comment_id } = req.params;

  try {
    // Execute the DELETE query
    const [result] = await pool.query(
      'DELETE FROM comments WHERE id = ? AND post_id = ?',
      [comment_id, post_id]
    );

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Comment not found or does not belong to the specified post' });
    }

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Error deleting comment', error });
  }
};






//Middleware

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access Denied,Not token Provid' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  updatePost,
  deletePostById,
  registerUser, 
  loginUser,
  verifyToken,
  putLikes,
  getLikeById,
  postcomment,
  getComments,
  profiledata,
  updateComment,
  deleteComment
};