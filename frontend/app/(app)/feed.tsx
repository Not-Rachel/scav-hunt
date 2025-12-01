import api from 'api';
import { useAuth } from 'app/AuthContext';
import SearchBar from 'app/components/SearchBar';
import { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { PostProps, usePostStore } from 'store/postStore';

export default function Feed() {
  const { posts, setPosts, clearPosts, addPost, updatePost, removePost } = usePostStore();
  const auth = useAuth();
  // const profilePosts =;
  //   const [feedPosts, setFeedPosts] = useState<PostProps[]>([]);
  const feedPosts = posts.filter((item) => item.author != auth?.user);

  useEffect(() => {
    if (posts.length <= 0) {
      getPost();
    } else {
      console.log('NEW USER', auth.user, posts);

      //   setFeedPosts(posts.filter((item) => item.author != auth?.user));
    }
  }, [auth?.user]);

  const getPost = () => {
    api
      .get('/api/scavposts/')
      .then((response) => response.data)
      .then((data) => {
        console.log(auth.user);
        setPosts(data);
        // setFeedPosts(data.filter((item) => item.author != auth?.user));
      })
      .catch((err) => console.error(err));
  };
  return (
    <ScrollView className="flex w-2/3 items-center">
      <View className="w-full">
        <View className="sticky">
          <SearchBar />
        </View>
        {feedPosts.map((post) => {
          // console.log(post.image);
          return (
            <View key={post.id} className="flex flex-col">
              <Text>
                {post.author_username}: {post.title} {post.content}
              </Text>
              <Image source={{ uri: post.image }} className="h-48 w-full"></Image>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
