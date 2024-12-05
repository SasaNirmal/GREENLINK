import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from '@/app/SignUpScreen';
import AddPostScreen from './app/Addpost';
import LoginScreen from './app/LoginScreen';
import CommentPage from './app/comment';
import Index from './app/index'; // Import the Index screen

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignUp">
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="AddPost" component={AddPostScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Comment" component={CommentPage} />
        <Stack.Screen name="Home" component={Index} /> {/* Add the Index screen */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}