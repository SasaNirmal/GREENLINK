import { View, Text } from 'react-native'
import React from 'react'
import { RouteProp } from '@react-navigation/native';

type ProductDetailsRouteProp = RouteProp<{ params: { productdelails: string; id: string; name: string; age: number } }, 'params'>;

const productdelails = ({ route }: { route: ProductDetailsRouteProp }) => {
  const { params } = route;
  return (
    <View>
      <Text>productdelails</Text>
      <Text>{params.productdelails}</Text>
      <Text>{params.id}</Text>
      <Text>{params.name}</Text>
      <Text>{params.age}</Text>
      
    </View>
  )
}

export default productdelails;