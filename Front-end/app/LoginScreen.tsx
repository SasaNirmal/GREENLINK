import React, { useState } from 'react';
import { TextInput, Button, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const LoginScreen = ({ navigation }: any) => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert('Error', 'Please enter both email and password.');
    return;
  }

  try {
    setLoading(true);

    const response = await axios.post('http://localhost:5000/api/posts/login', {
      email,
      password,
    });

    const { token } = response.data;

    // Store the token in AsyncStorage
    await AsyncStorage.setItem('token', token);

    Alert.alert('Success', 'Login successful!');
    
    // Navigate to the home screen (index)
    router.navigate('/'); 
  } catch (error: any) {
    console.error(error);
    Alert.alert('Error', error.response?.data?.message || 'Login failed. Please try again.');
  } finally {
    setLoading(false);
  }
};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Sign In'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={() => router.navigate('/')}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

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
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
  },
  linkText: {
    color: '#4CAF50',
    fontSize: 14,
    marginTop: 20,
  },
});

function setLoading(arg0: boolean) {
  throw new Error('Function not implemented.');
}
