import { useEffect, useState } from 'react';
import api from '../../api';
import { Button, Text, TextInput, View, Image, Platform, Pressable } from 'react-native';
import { content } from 'tailwind.config';
import * as ImagePicker from 'expo-image-picker';
import Icon from '../../assets/icon.png';
import { router, useLocalSearchParams } from 'expo-router';
import getItems from '../../naturalistApi';
import Dropdown from 'react-native-input-select';
import { useItemStore } from 'store/itemStore';
import { usePostStore } from 'store/postStore';
export default function CreatePost() {
  const { items, setItems, clearItems } = useItemStore();
  const { addPost } = usePostStore();

  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [naturalistItem, setNaturalistItem] = useState<number | null>(null);
  const [naturalistName, setNaturalistName] = useState(null);
  const [naturalistId, setNaturalistId] = useState(null);
  const [selectedImage, setSelectedImage] = useState<Object | undefined>(undefined);

  const local = useLocalSearchParams();
  useEffect(() => {
    const init = async () => {
      if (local.taxon_name) {
        setNaturalistName(local.taxon_name);
        console.log(local.taxon_name);
      }
      if (local.taxon_id) {
        setNaturalistId(local.taxon_id);
        // const item = getItems(`taxon_id=${local.taxon_id}`).then((r) =>
        //   setNaturalistItem(r[0].taxon)
        // );
      }
    };
    init();
  }, []);

  const createPost = async (e: Event) => {
    e.preventDefault();
    if (!selectedImage) {
      alert('You did not select any image.');
      return;
    }
    if (title.length <= 0) {
      alert('Upload needs a title');
      return;
    }
    if (!naturalistItem) {
      alert('Must Pick item');
      return;
    }
    const formData = new FormData();

    formData.append('title', title);
    formData.append('content', content);
    formData.append('taxon_id', naturalistItem);
    const sendItem = items?.filter((item) => item.taxon.id == naturalistItem)[0];
    formData.append(
      'found_item',
      sendItem.taxon.preferred_common_name
        ? sendItem.taxon.preferred_common_name.toUpperCase()
        : sendItem.taxon.name.toUpperCase()
    );
    console.log(items?.filter((item) => item.taxon.id == naturalistItem));
    // formData.append('found_item', naturalistName);

    if (Platform.OS === 'web') {
      const blob = await fetch(selectedImage.uri).then((r) => r.blob());
      formData.append('image', blob, selectedImage.fileName || 'upload.jpg');
    } else {
      formData.append('image', {
        uri: selectedImage.uri,
        type: selectedImage.mimeType || 'image/jpeg',
        name: selectedImage.fileName || 'upload.jpg',
      } as any);
    }

    console.log('ID:', formData.get('taxon_id'));

    api
      .post('/api/scavposts/', formData)
      .then((response) => {
        console.log(response);
        if (response.status !== 201) {
          alert('Failed to create post');
          return;
        }

        setSelectedImage(undefined);
        setNaturalistItem(null);
        setTitle('');
        setContent('');

        router.replace('/(app)/profile');
      })
      .catch((err) => console.error(err));
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  return (
    <View className="flex items-center p-8">
      <Text>Found the item!</Text>

      <Pressable onPress={pickImageAsync}>
        <Image
          source={{ uri: selectedImage ? selectedImage.uri : Icon.uri }}
          className="h-48 w-48"></Image>
      </Pressable>

      <TextInput placeholder="Title" className="border-2 border-teal-600" onChangeText={setTitle} />
      <TextInput
        placeholder="Content"
        className="border-2 border-teal-600 bg-teal-300"
        value={content}
        onChangeText={setContent}
      />

      <Dropdown
        placeholder="Select an option..."
        placeholderStyle={{ color: 'red' }}
        options={
          items?.map((item) => ({
            label: item.taxon.preferred_common_name
              ? item.taxon.preferred_common_name.toUpperCase()
              : item.taxon.name.toUpperCase(),
            value: item.taxon.id,
          })) ?? []
        }
        selectedValue={naturalistItem}
        onValueChange={(value) => setNaturalistItem(value)}
        primaryColor={'green'}
      />
      {/* <Button title="Choose a photo" /> */}
      <Button title="Post!" onPress={createPost}></Button>
    </View>
  );
}
