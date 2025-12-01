import { useState } from 'react';
import { View, Modal, Image, Text, Button, Pressable, TextInput, Platform } from 'react-native';
import api from 'api';
import * as ImagePicker from 'expo-image-picker';

import { FaEllipsisVertical } from 'react-icons/fa6';
export default function PostModal({ post, setPost, deletePost, editPost }) {
  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);

  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newImage, setNewImage] = useState(null);
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setNewImage(result.assets[0]);
    }
  };

  const handleEdit = async () => {
    const formData = new FormData();

    if (newTitle != post.title) formData.append('title', newTitle);
    if (newContent != post.content) formData.append('content', newContent);

    if (newImage) {
      if (Platform.OS === 'web') {
        const blob = await fetch(newImage.uri).then((r) => r.blob());
        formData.append('image', blob, newImage.fileName || 'upload.jpg');
      } else {
        formData.append('image', {
          uri: newImage.uri,
          type: newImage.mimeType || 'image/jpeg',
          name: newImage.fileName || 'upload.jpg',
        } as any);
      }
    }
    console.log(formData);
    editPost(formData, post.id);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={post != null}
      onRequestClose={() => {
        setPost(null);
      }}>
      <View className="z-50 flex h-full w-[70lvw] items-center self-center bg-cyan-400">
        <Pressable onPress={() => setPost(null)} className="w-full bg-cyan-950">
          <Text className="p-2 text-center font-bold text-slate-50">CLOSE</Text>
        </Pressable>

        {post != null && (
          <View className="flex h-full items-center py-8">
            {/* <Pressable onPress={() => {}}> */}
            <View className="relative flex h-[70%]  w-[50lvw] flex-row">
              {editing ? (
                <Pressable onPress={pickImageAsync} className="group relative">
                  <Image
                    source={{ uri: newImage ? newImage.uri : post.image }}
                    className="h-full w-[50lvw] bg-cover"
                  />
                  <View className="pressed:bg-black/30 absolute inset-0 flex items-center justify-center hover:bg-black/50">
                    <Text className="font-extrabold text-white">Press to change image</Text>
                  </View>
                </Pressable>
              ) : (
                <Image
                  className="aspect-auto h-full w-[50lvw] bg-cover"
                  source={{ uri: post.image }}
                />
              )}
              <Pressable onPress={() => setShowMenu(!showMenu)}>
                <FaEllipsisVertical />
                {showMenu && (
                  <View className="absolute my-4 flex flex-col gap-4 rounded-lg bg-white p-4">
                    <Button onPress={() => deletePost(post.id)} title="Delete"></Button>
                    <Button
                      onPress={() => {
                        setEditing(true);
                        setNewImage(null);
                        setNewTitle(post.title);
                        setNewContent(post.content);
                      }}
                      title="Edit"></Button>
                  </View>
                )}
              </Pressable>
            </View>
            {/* </Pressable> */}
            <View className="my-4 flex w-full justify-start">
              <Text>{post.found_item}</Text>

              {!editing ? (
                <Text>{post.title}</Text>
              ) : (
                <TextInput
                  placeholder="New Title"
                  className="border-2 border-teal-600"
                  value={newTitle}
                  onChangeText={setNewTitle}></TextInput>
              )}
              {!editing ? (
                <Text>{post.content}</Text>
              ) : (
                <TextInput
                  placeholder="New Description"
                  className="border-2 border-teal-600"
                  multiline={true}
                  value={newContent}
                  onChangeText={setNewContent}></TextInput>
              )}
            </View>

            {editing && (
              <Button
                title="Finish Edit"
                onPress={() => {
                  setEditing(false);
                  handleEdit();
                }}></Button>
            )}
          </View>
        )}
      </View>
    </Modal>
  );
}
