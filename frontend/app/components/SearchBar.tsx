import { TextInput, View } from 'react-native';
import api from 'api';
import { useState } from 'react';
export default function SearchBar() {
  const [searchValue, setSearchValue] = useState('');
  return (
    <View>
      <TextInput
        placeholder="Start searching plants, animals, and more..."
        onChangeText={setSearchValue}></TextInput>
    </View>
  );
}
