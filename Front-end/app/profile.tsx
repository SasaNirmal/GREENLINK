import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import Header from '@/layout/header'; // Adjust the path as necessary
import tw from 'tailwind-react-native-classnames';

const Profile = () => {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View style={tw`w-full flex-1 bg-white`}>
      <Header 
        Left={undefined}
        Right={<TouchableOpacity onPress={() => router.push('/SignUpScreen')}>
                  <Feather name="log-out" size={27} color="black" />
               </TouchableOpacity>}
        centerText='Profile'
        Center={undefined}
      />
      
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  profileEmail: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});