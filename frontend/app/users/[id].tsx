import { Link, useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

function UserPage() {
  const params = useLocalSearchParams();

  return (
    <View>
      <Text className="text-red-500">User Page {params.id}</Text>
    </View>
  );
}

export default UserPage;
