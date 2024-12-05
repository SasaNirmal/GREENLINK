import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Button, StyleSheet } from 'react-native';
import axios from 'axios';

interface Post {
  id: number;
  description: string;
  image_url: string;
}

const HomeScreen = ({ navigation }: any) => {
  const [posts, setPosts] = useState<Post[]>([]);

  // Fetch posts from the backend
  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {posts.map((post) => (
        <View key={post.id} style={styles.postCard}>
          <Image source={{ uri: `http://localhost:5000/${post.image_url}` }} style={styles.image} />
          <Text style={styles.description}>{post.description}</Text>
          <Button title="Like" onPress={() => console.log('Like pressed')} />
          <Button title="Comment" onPress={() => console.log('Comment pressed')} />
        </View>
      ))}
      <Button title="Add New Post" onPress={() => navigation.navigate('AddPost')} />
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  postCard: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  description: {
    marginVertical: 10,
    fontSize: 16,
  },
});
