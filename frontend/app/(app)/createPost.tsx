import { useEffect, useState } from 'react';
import api, { apiFetch } from '../../api';
import {
  Button,
  Text,
  TextInput,
  View,
  Image,
  Platform,
  Pressable,
  GestureResponderEvent,
} from 'react-native';
// import { content } from 'tailwind.config';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import getItems from '../../naturalistApi';
import Dropdown from 'react-native-input-select';
import { useItemStore } from '../../store/itemStore';
import { usePostStore } from '../../store/postStore';
import Icon from '../../assets/icon.png';
import { ACCESS_TOKEN } from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreatePost() {
  const { items, setItems, clearItems } = useItemStore();
  const { addPost } = usePostStore();

  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [naturalistItem, setNaturalistItem] = useState<number | undefined>(undefined);
  const [naturalistName, setNaturalistName] = useState<string | null>(null);
  const [naturalistId, setNaturalistId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const local = useLocalSearchParams();
  useEffect(() => {
    const init = async () => {
      if (local.taxon_name) {
        setNaturalistName(local.taxon_name[0]);
        console.log(local.taxon_name);
      }
      if (local.taxon_id) {
        setNaturalistId(local.taxon_id[0]);
        // const item = getItems(`taxon_id=${local.taxon_id}`).then((r) =>
        //   setNaturalistItem(r[0].taxon)
        // );
      }
    };
    init();
  }, []);

  const createPost = async (e: GestureResponderEvent) => {
    e.preventDefault();

    const token = await AsyncStorage.getItem(ACCESS_TOKEN);

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
    formData.append('taxon_id', naturalistItem.toString());
    formData.append('latitude', '0.0');
    formData.append('longitude', '0.0');
    const sendItem = items?.filter((item) => item.taxon.id == naturalistItem)[0];
    formData.append(
      'found_item',
      sendItem.taxon.preferred_common_name
        ? sendItem.taxon.preferred_common_name.toUpperCase()
        : sendItem.taxon.name.toUpperCase()
    );
    // console.log(items?.filter((item) => item.taxon.id == naturalistItem));
    // formData.append('found_item', naturalistName);

    if (Platform.OS === 'web') {
      const blob = await fetch(selectedImage.uri).then((r) => r.blob());
      formData.append('image', blob, selectedImage.fileName || 'upload.jpg');
    } else {
      formData.append('image', {
        uri: selectedImage.uri,
        // type: selectedImage.mimeType || 'image/jpeg',
        type: 'image/jpeg',
        name: selectedImage.fileName || 'upload.jpg',
      } as any);
    }
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      setIsLoading(true);
      console.log('BaseURL:', api.defaults.baseURL);

      const response = await apiFetch('/api/scavposts/', {
        method: 'POST',
        body: formData,
      });

      console.log('API FETCH RESPONSE:', response);
      addPost(response);

      // if (Platform.OS === 'web') {
      //   const response = await api.post('/api/scavposts/', formData);
      //   if (response.status !== 201) {
      //     alert('Failed to create post');
      //     return;
      //   }
      //   addPost(response.data);
      // } else {
      //   const response = await fetch('http://10.0.2.2:8000/api/scavposts/', {
      //     method: 'POST',
      //     headers: {
      //       Authorization: `Bearer ${token}`, // if you need auth
      //     },
      //     body: formData,
      //   });
      //   if (!response.ok) {
      //     alert('Failed to create post');
      //     return;
      //   }

      //   const data = await response.json();
      //   console.log('Upload response:', data);
      //   addPost(data);
      // }
      // const response = await api.post('/api/scavposts/', { test: 'test' });
      // console.log(response);

      setSelectedImage(null);
      setNaturalistItem(undefined);
      setTitle('');
      setContent('');

      router.replace('/(app)/profile');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
          source={selectedImage ? { uri: selectedImage.uri } : require('../../assets/icon.png')}
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
        onValueChange={(value) => setNaturalistItem(value as number)}
        primaryColor={'green'}
      />
      {/* <Button title="Choose a photo" /> */}
      <Button
        title="Post!"
        onPress={async (e: GestureResponderEvent) => {
          if (!isLoading) createPost(e);
        }}></Button>
    </View>
  );
}
