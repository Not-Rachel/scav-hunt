import { View, Modal, Image, Text } from 'react-native';
import { PostProps } from 'store/postStore';
export default function FeedPost(post: PostProps) {
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
