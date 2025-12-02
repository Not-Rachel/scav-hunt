import api, { apiFetch } from 'api';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESS_TOKEN } from '../../constants';

export default function profile() {
  const [showPost, setShowPost] = useState<PostProps | null>(null);

  const { posts, setPosts, addPost, updatePost, removePost, getProfilePosts } = usePostStore();
  const auth = useAuth();
  const profilePosts = getProfilePosts(auth?.user);

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
      removePost(id);
    } catch (err) {
      console.error(err);
    }
  };
  // const editPost = async (formData: FormData, id: number) => {
  //   try {
  //     const response = await api.patch(`/api/scavpost/update/${id}/`, formData);
  //     if (response.status != 200) {
  //       alert('Failed to edit');
  //       return;
  //     }
  //     const updatedPost = response.data;
  //     setShowPost(updatedPost); //rerender
  //     updatePost(updatedPost);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  const editPost = async (formData: FormData, id: number) => {
    try {
      // if (Platform.OS === 'web') {
      //   // Axios works fine on web
      //   const response = await api.patch(`/api/scavpost/update/${id}/`, formData);
      //   if (response.status !== 200) {
      //     alert('Failed to edit');
      //     return;
      //   }
      //   const updatedPost = response.data;
      //   setShowPost(updatedPost);
      //   updatePost(updatedPost);
      // } else {
      //   // Use fetch on native
      //   const token = await AsyncStorage.getItem(ACCESS_TOKEN);
      //   const response = await fetch(`http://10.0.2.2:8000/api/scavpost/update/${id}/`, {
      //     method: 'PATCH',
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //     body: formData,
      //   });

      // if (!response.ok) {
      //   alert('Failed to edit');
      //   return;
      // }
      const response = await apiFetch(`/api/scavpost/update/${id}/`, {
        method: 'PATCH',
        body: formData,
      });

      console.log('API FETCH RESPONSE:', response);
      addPost(response);

      // const updatedPost = await response.json();
      // setShowPost(updatedPost);
      // updatePost(updatedPost);
      setShowPost(response);
      updatePost(response);
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
    <ScrollView className="flex " contentContainerClassName="items-center">
      {/* <SafeAreaProvider>
        <SafeAreaView> */}
      <View className="my-8 py-4">
        <Text>Welcome to my profile{}</Text>
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
                onPress={() => {
                  console.log('PRESSED');
                  setShowPost(post);
                }}>
                <Image className="h-64 w-64 object-contain  " source={{ uri: post.image }} />
              </Pressable>
              <Text className="my-2 font-bold">{post.title}</Text>
            </View>
          );
        })}
      </View>
      {/* </SafeAreaView>
      </SafeAreaProvider> */}
    </ScrollView>
  );
}
