import { View, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import tw from 'tailwind-react-native-classnames';
import { router } from 'expo-router';

const footer = () => {
  return (
    <View style={tw`w-full px-12 rounded-t-3xl absolute h-15 bottom-0 left-0 z-50 bg-green-500 flex-row items-center justify-between`}>
       
        <TouchableOpacity onPress={()=>router.navigate("/")} style={tw`flex-coulm items-center justify-center`}>
            <MaterialIcons name="home-max" size={24} color="black" />
            <Link href={"/"}>Home</Link>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>router.navigate("/Addpost")} style={tw`flex-coulm items-center justify-center`}>
            <Ionicons name="add-circle-outline" size={35} color="Black" />
            <Link href={"/Addpost"}>Post</Link>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>router.navigate("/profile")} style={tw`flex-coulm items-center justify-center`}>
            <AntDesign name="user" size={24} color="black" />
            <Link href={"/profile"}>Profile</Link>
        </TouchableOpacity>

    </View>
  )
}

export default footer