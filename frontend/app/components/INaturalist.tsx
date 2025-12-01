import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Button, Image, TextInput, Pressable, ImageBackground } from 'react-native';
import getItems from '../../naturalistApi';
import { useItemStore } from 'store/itemStore';
// import lodash
export default function NaturalistItems() {
  // const token = 'usr-CvZuhFDUcX0pvrf25jq1ZbX-TbXeJmjmfUYhIUBRhig';
  const { items, setItems, clearItems } = useItemStore();
  const [image, setImage] = useState(null);
  const [locationText, setLocationText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!items) {
      console.log('GETTING NEW');
      getItems().then((r) => setItems(r));
    }
    setIsLoading(false);
  }, []);

  async function getNewItems(query = '') {
    setIsLoading(true);
    setItems(await getItems(query));
    setIsLoading(false);
  }

  function showItem(item) {
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
        {/* <Button title="Collect All" onPress={async () => setItems(await getItems())} /> */}
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
