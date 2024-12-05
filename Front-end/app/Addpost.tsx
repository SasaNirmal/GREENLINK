import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dszvby8wh/image/upload';
const UPLOAD_PRESET = 'ml_default';

const AddPostScreen = () => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      // On the web, directly use the picked URI without saving it to file system
      setImage(localUri);
    }
  };

  const uploadToCloudinary = async (imageUri: string): Promise<string> => {
    const formData = new FormData();
    
    try {
      // Fetch the image as a Blob
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      // Construct the file object with the blob
      const file = new File([blob], 'upload.jpg', { type: 'image/jpeg' });
  
      // Append the file and the upload preset to FormData
      formData.append('file', file); 
      formData.append('upload_preset', UPLOAD_PRESET);
  
      // Send the request to Cloudinary
      const cloudinaryResponse = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      return cloudinaryResponse.data.secure_url; // Return the uploaded image URL
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };
  
  
  const submitPost = async () => {
    if (!description || !image) {
      Alert.alert('Error', 'Please enter a description and pick an image.');
      return;
    }

    try {
      setLoading(true);

      // Step 1: Upload the image to Cloudinary
      const imageUrl = await uploadToCloudinary(image);

      // Step 2: Send post data to the backend
      const response = await axios.post(
        'http://localhost:5000/api/posts/create',
        {
          description,
          imageUrl,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        Alert.alert('Success', 'Post created successfully!');
        navigation.navigate('index'); // Update this to your Home screen route name
      } else {
        throw new Error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Post</Text>
      <TextInput
        placeholder="Enter a description..."
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        editable={!loading}
      />
      <TouchableOpacity
        style={styles.imagePicker}
        onPress={pickImage}
        disabled={loading}
      >
        <Ionicons name="image-outline" size={24} color="white" />
        <Text style={styles.imagePickerText}>Pick an Image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={submitPost}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Post</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AddPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  imagePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  imagePickerText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
