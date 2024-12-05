import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { AntDesign, EvilIcons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types'; // Adjust the path as necessary
import tw from 'tailwind-react-native-classnames';
import Header from '@/layout/header'; // Adjust the path as necessary

type Post = {
  id: number;
  description: string;
  imageUrl?: string;
  likes: number;
};
const Index = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [likeColors, setLikeColors] = useState<{ [key: number]: string }>({});
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts/');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLikePress = async (id: number) => {
    try {
      await axios.put(`http://localhost:5000/api/posts/like/${id}`);
      const response = await axios.get(`http://localhost:5000/api/posts/likebyd/${id}`);
      const updatedLikes = response.data.likes;
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? { ...post, likes: updatedLikes } : post
        )
      );
      setLikeColors((prevColors) => ({
        ...prevColors,
        [id]: prevColors[id] === 'black' ? 'blue' : 'blue',
      }));
      console.log(`Post with id ${id} liked!`);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDeletePress = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      console.log(`Post with id ${id} deleted!`);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEditPress = (id: number) => {
    navigation.navigate('EditPost', { postId: id });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00ff00" style={styles.loading} />;
  }

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <TouchableOpacity onPress={() => handleDeletePress(item.id)} style={styles.deleteButton}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          onError={(error) => console.error('Error loading image:', error.nativeEvent.error)}
        />
      )}
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleLikePress(item.id)} style={styles.actionButton}>
          <AntDesign name="like2" size={24} color={likeColors[item.id] || 'black'} />
          <Text style={styles.likes}>{item.likes} Likes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('comment', { post_id: item.id })}>
          <EvilIcons name="comment" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        Left={undefined}
        Right={undefined}
        centerText="G r e e n L i n k"
        Center={undefined}
      />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postCard: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#64748b',
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likes: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
});
