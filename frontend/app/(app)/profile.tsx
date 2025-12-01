import api from 'api';
import FeedPost from 'app/components/FeedPost';
import PostModal from 'app/components/PostModal';
import { useEffect, useState } from 'react';
import {
  Button,
  Text,
  TextInput,
  View,
  Image,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { usePostStore, PostProps } from 'store/postStore';
import { AuthProvider, useAuth } from '../AuthContext';

export default function profile() {
  // const [posts, setPosts] = useState([]);
  const [showPost, setShowPost] = useState<PostProps | null>(null);

  const { posts, setPosts, clearPosts, addPost, updatePost, removePost } = usePostStore();
  const auth = useAuth();
  // const profilePosts =;
  // const [profilePosts, setProfilePosts] = useState<PostProps[]>([]);
  const profilePosts = posts.filter((item) => item.author == auth?.user);

  useEffect(() => {
    if (posts.length <= 0) {
      getPost();
    } else {
      console.log('NEW USER', auth.user, posts);

      // setProfilePosts(posts.filter((item) => item.author == auth?.user));
    }
  }, [showPost, auth?.user]);

  const getPost = () => {
    api
      .get('/api/scavposts/')
      .then((response) => response.data)
      .then((data) => {
        console.log('GETTING POST', data[0].author);
        setPosts(data);
        // setProfilePosts(data.filter((item) => item.author == auth?.user));
      })
      .catch((err) => console.error(err));
  };

  const deletePost = async (id: number) => {
    try {
      const response = await api.delete(`/api/scavpost/delete/${id}/`);
      if (response.status !== 204) {
        alert('Failed to delete');
        return;
      }
      setShowPost(null);
      // getPost(); // TODO: make more efficient
      removePost(id);
    } catch (err) {
      console.error(err);
    }
  };
  const editPost = async (formData, id: number) => {
    try {
      const response = await api.patch(`/api/scavpost/update/${id}/`, formData);
      if (response.status != 200) {
        alert('Failed to edit');
        return;
      }
      setShowPost(showPost); //rerender
      // getPost(); // TODO: make more efficient
      updatePost(showPost);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (id: number) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Delete Post? This will be permanate')) deletePost(id);
      else console.log('Deletion cancelled');
      return;
    }

    Alert.alert('Delete Post', 'Confirm Deletion', [
      {
        text: 'Cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          deletePost(id);
        },
      },
    ]);
  };
  return (
    <ScrollView className="flex items-center">
      <SafeAreaProvider>
        <SafeAreaView>
          <View className="my-8 py-4">
            <Text>{}</Text>
          </View>
          <PostModal
            post={showPost}
            setPost={setShowPost}
            deletePost={handleDelete}
            editPost={editPost}></PostModal>

          <View className="grid grid-cols-3 gap-4 ">
            {profilePosts.map((post) => {
              return (
                <View>
                  <Pressable
                    key={post.id}
                    className="group relative"
                    onPress={() => setShowPost(post)}>
                    <Image className="h-64 w-64 object-contain  " source={{ uri: post.image }} />
                    <View className="pressed:bg-black/30 absolute inset-0 hover:bg-slate-400/50"></View>
                  </Pressable>
                  <Text className="my-2 font-bold">{post.title}</Text>
                </View>
              );
            })}
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </ScrollView>
  );
}
