import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import { Button, View, Text } from 'react-native';
import { useAuth } from '../AuthContext';
import { FontAwesome6 } from '@expo/vector-icons';

export default function Nav() {
  const router = useRouter();
  const auth = useAuth();
  if (auth === null || auth.isAuthorized === null) {
    return null; // or splash/loading screen
  }

  return (
    <View className="z-99 flex flex-row items-center justify-center gap-8 p-12">
      <Link href={'/'}>HOME</Link>
      <Link href={'/(app)/map'}>MAP</Link>
      <Link href={'/(app)/createPost'} className="text-bold">
        <FontAwesome6 name="circle-plus" size={24} color="black" />
      </Link>
      <Link href={'/(app)/profile'} className="text-bold">
        Profile
      </Link>
      <Link href={'/(app)/feed'} className="text-bold">
        Feed
      </Link>
      {!auth.isAuthorized && <Link href={'/login'}>LOG IN</Link>}
      {auth.isAuthorized && (
        <Button
          title="
          LOG OUT
        "
          onPress={async (e) => {
            e.preventDefault();
            await auth.logout();
            router.replace('/');
          }}></Button>
      )}
    </View>
  );
}
