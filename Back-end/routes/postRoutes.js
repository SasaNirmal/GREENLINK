const express = require('express');
const multer = require('multer');
const path = require('path');

const {
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
} = require('../controllers/postController.js');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' +(file.originalname));
  },
});
const upload = multer({ storage });

// Routes
router.post('/create', upload.single('image'), createPost),
router.get('/', getAllPosts);
router.put('/:id', upload.single('image'), updatePost);
router.delete('/:id',  deletePostById);
router.post('/register', registerUser);
router.post('/login', loginUser);
//putlikes
router.put('/like/:id', putLikes);
router.get('/likebyd/:id', getLikeById);

//for comments
router.post('/comments',postcomment);
router.get('/comments/:post_id',getComments);
router.put('/comments/:post_id/:comment_id', updateComment);
router.delete('/comments/:post_id/:comment_id', deleteComment);



module.exports = router;