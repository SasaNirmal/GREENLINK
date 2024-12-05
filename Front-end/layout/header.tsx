import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import tw from 'tailwind-react-native-classnames';
import { Entypo } from '@expo/vector-icons';

interface IHeader{
    Left: React.ReactNode;
    Right: React.ReactNode;
    centerText?: string;
    Center: React.ReactNode;
}

//i am using "?" for optional parameter
//optinala kiynne wena wenama nathnam meka use karanna puluwan
const Header = ({Left,centerText, Right,Center}: IHeader) => {
  return (
    //i get the elevation from like shadow
    <View style={[tw`w-full h-[70px] flex-row item-end justify-between bottom-0 left-0 bg-green-500 px-7 `, { elevation: 5 }]}>
        {Left ? Left :<View />}

        {/*center eke centeatext eka tiyenwnm Text eka denna nattm <View/> denna*/}
        {Center ? Center : centerText?<Text style={ styles.centerText}>{centerText}</Text>:<View />}
        
        {Right ? Right :<View />}
    </View>
  )
}

export default Header;

const styles = StyleSheet.create({
  centerText: {
    fontFamily: 'italic', // Change this to your desired font family
    fontSize: 40, // Adjust the font size as needed
    fontWeight: 'semibold', // Adjust the font weight as needed
    color: 'Black', // Adjust the font color as needed
  },
});