import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import Form from './components/Form';
export default function Login() {
  return (
    <View className="bg-slate-400 p-4">
      <Text>Make sure you login</Text>
      <Form route={'/api/token/'} method={'login'}></Form>
      <Link href={'/register'}>No account? Make sure you register</Link>
    </View>
  );
}
