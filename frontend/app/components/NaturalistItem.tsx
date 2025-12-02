import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Button, Image, TextInput, Pressable, ImageBackground } from 'react-native';
// import getItems from '../../naturalistApi';
import { useItemStore } from 'store/itemStore';

import api from 'api';
import { useAuth } from 'app/AuthContext';
export default function NaturalistItems() {
  const { items, setItems } = useItemStore();
  const [locationText, setLocationText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAuthorized } = useAuth();

  useEffect(() => {
    if (!isAuthorized) return;
    setIsLoading(true);
    if (!items) {
      getNewItems();
    }
    setIsLoading(false);
  }, []);

  async function getNewItems(query = '') {
    // /naturalist_view?lat=33.654474&lng=-117.609137&query=some_filter
    setIsLoading(true);
    // setItems(await getItems(query));
    const response = await api.get('/api/naturalist-daily/', {
      params: { lat: 33.654474, lng: -117.609137, query: query },
    });
    setItems(response.data.data.results);
    console.log(response.data.data.results);
    setIsLoading(false);
  }

  function showItem(item: any) {
    return (
      <View className="w-36 overflow-hidden rounded-xl  ">
        <ImageBackground
          className="flex h-36 justify-end "
          source={{
            uri: item?.taxon.default_photo.medium_url,
          }}>
          <View className="bg-teal-950/30">
            <Text className="text-wrap text-center text-lg  font-semibold text-slate-100">
              {item?.taxon.preferred_common_name
                ? item?.taxon.preferred_common_name
                : item?.taxon.name}
            </Text>
          </View>
        </ImageBackground>
      </View>
    );
  }

  return (
    <View className="flex items-center justify-center">
      <TextInput
        value={locationText}
        placeholder="Enter your Region"
        onChangeText={setLocationText}
        className="w-[30%] border-2 border-dashed border-green-950 p-2"
      />
      <View className="flex flex-row">
        {isAuthorized && (
          <View>
            <Button title="Collect All" onPress={async () => await getNewItems()} />
            <Button
              title="Collect Plants"
              onPress={async () => await getNewItems('iconic_taxa=Plantae')}
            />
            <Button
              title="Collect Animals"
              onPress={async () => await getNewItems('iconic_taxa=Animalia')}
            />
            <Button
              title="Collect Mammals"
              onPress={async () => await getNewItems('iconic_taxa=Mammalia')}
            />
          </View>
        )}
      </View>
      {!isLoading ? (
        <View className="my-4 grid grid-cols-4 gap-4 ">
          {items?.map((item) => {
            return (
              <View key={item.taxon.id} className="flex h-auto justify-end  ">
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/(app)/createPost',
                      params: {
                        taxon_id: item.taxon.id,
                        taxon_name: item.taxon.preferred_common_name
                          ? item.taxon.preferred_common_name
                          : item.taxon.name,
                      },
                    })
                  }>
                  {showItem(item)}
                </Pressable>
              </View>
            );
          })}
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}
