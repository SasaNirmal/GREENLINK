import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

type RouteParams = {
  post_id: number;
};

const CommentPage = () => {
  const route = useRoute();
  const { post_id } = route.params as RouteParams; // Get the post_id passed from the previous screen
  type Comment = {
    id: number;
    text: string;
    created_at: string;
  };
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch comments for the specific post
  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/comments/${post_id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(); // Fetch comments when the component is mounted
  }, [post_id]);

  // Handle comment update
  const handleUpdateComment = async (comment_id: number, text: string) => {
    const updatedText = prompt("Edit your comment:", text);
    if (updatedText !== null) {
      try {
        await axios.put(`http://localhost:5000/api/posts/comments/${post_id}/${comment_id}`, { text: updatedText });
        fetchComments(); // Refresh comments list after update
      } catch (error) {
        console.error('Error updating comment:', error);
      }
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (comment_id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/comments/${post_id}/${comment_id}`);
      fetchComments(); // Refresh comments list after deletion
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await axios.post(`http://localhost:5000/api/posts/comments`, { post_id, text: newComment });
      setComments([...comments, { id: Date.now(), text: newComment, created_at: new Date().toISOString() }]); // Add new comment to the list
      setNewComment(''); // Clear the input field
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00ff00" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Comments</Text>

      {/* Input field for adding a comment */}
      <TextInput
        style={styles.input}
        placeholder="Write a comment..."
        value={newComment}
        onChangeText={setNewComment}
      />

      {/* Submit comment button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleAddComment} disabled={submitting}>
        {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Submit</Text>}
      </TouchableOpacity>

      {/* List of comments */}
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.commentCard}>
            <Text style={styles.commentText}>{item.text}</Text>
            <Text style={styles.commentDate}>
              {new Date(item.created_at).toLocaleString()}
            </Text>
            <View style={styles.actions}>
              {/* Update Button */}
              <TouchableOpacity onPress={() => handleUpdateComment(item.id, item.text)}>
                <Text style={styles.updateButton}>Edit</Text>
              </TouchableOpacity>

              {/* Delete Button */}
              <TouchableOpacity onPress={() => handleDeleteComment(item.id)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingLeft: 10, marginBottom: 20 },
  submitButton: { backgroundColor: '#4CAF50', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, alignItems: 'center' },
  submitText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  commentCard: { padding: 15, marginBottom: 10, backgroundColor: '#f9f9f9', borderRadius: 8 },
  commentText: { fontSize: 16 },
  commentDate: { fontSize: 12, color: 'gray', marginTop: 5 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  updateButton: { color: '#007BFF' },
  deleteButton: { color: 'red' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default CommentPage;
