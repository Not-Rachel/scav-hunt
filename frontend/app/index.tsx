import { View, ScrollView } from 'react-native';
import NaturalistItems from './components/NaturalistItem';
import '../global.css';

export default function Page() {
  return (
    <ScrollView>
      <View className="m-4 flex-1 items-center justify-center bg-white">
        <NaturalistItems></NaturalistItems>
      </View>
    </ScrollView>
  );
}
