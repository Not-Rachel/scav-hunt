import { View, Modal, Image, Text } from 'react-native';
export default function FeedPost(post) {
  return (
    <View>
      <Modal>
        <Image source={{ uri: post.image }}></Image>
        <Text>
          {post.title} {post.content}
        </Text>
      </Modal>
    </View>
  );
}
