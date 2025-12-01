import { Button, Text, TextInput, View, FlatList, ScrollView, Image } from 'react-native';
import NaturalistItems from './components/INaturalist';
import { Link, useNavigation } from 'expo-router';
import '../global.css';
// import { navigate } from 'expo-router/build/global-state/routing';
import { useEffect, useState } from 'react';
import api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Nav from './components/Nav';
import Natural from './components/INaturalist';

type PostProps = {
  id: number;
  author: string;
  author_username: string;
  title: string;
  content: string;
  found_item: string;
  image: Blob;
};

export default function Page() {
  const navigation = useNavigation();

  return (
    <ScrollView>
      <View className="m-4 flex-1 items-center justify-center bg-white">
        <NaturalistItems></NaturalistItems>
      </View>
    </ScrollView>
  );
}
