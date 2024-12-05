import { View } from 'react-native';
import { Slot, Link, router } from 'expo-router';
import tw from 'tailwind-react-native-classnames';
import Footer from "@/layout/footer";
import Header from "@/layout/header";

//there is bottom layer dsign
const Rootlayout = () => {
  return (
    /*this is bottom layer desing,ther use flex-1=we can use flex-1/flex-2*/
    <View style={tw`relative w-full flex-1`}>
      <Slot />
      <Footer/>
    </View>
    //gfagjsfakfg
  );
};

export default Rootlayout;