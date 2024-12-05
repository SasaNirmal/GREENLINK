import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface PostCardProps {
  post: { description: string; image_url: string };
  onLike: () => void;
  onComment: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment }) => (
  <View>
    <Image source={{ uri: post.image_url }} style={{ width: 100, height: 100 }} />
    <Text>{post.description}</Text>
    <TouchableOpacity onPress={onLike}>
      <Text>Like</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={onComment}>
      <Text>Comment</Text>
    </TouchableOpacity>
  </View>
);

export default PostCard;
