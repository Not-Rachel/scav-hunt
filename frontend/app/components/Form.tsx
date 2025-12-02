import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { TextInput, View, Text, Button } from 'react-native';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';
import api from '../../api';
import { navigate } from 'expo-router/build/global-state/routing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../AuthContext';
import { jwtDecode } from 'jwt-decode';
type FormProps = {
  route: string;
  method: string;
};

export default function Form({ route, method }: FormProps) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmedPassword, setConfirmedPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setIsAuthorized, setUser } = useAuth();

  async function handleSubmit(): Promise<void> {
    console.log('Username, password', username, password, route, method);
    setLoading(true);
    // event.preventDefault();
    try {
      if (method === 'register' && password != confirmedPassword) {
        throw new Error('Passwords do not match');
      }
      console.log('send');
      const response = await api.post(route, { username, password });
      console.log('response');
      if (response.status == 200 && method === 'login') {
        await AsyncStorage.setItem(ACCESS_TOKEN, response.data.access);
        await AsyncStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        const decoded: any = jwtDecode(response.data.access);
        setUser(decoded.user_id);
        setIsAuthorized(true);
        router.replace('/(app)/profile');
      } else router.replace('/login');
    } catch (error) {
      setError((error as Error).message);
      setConfirmedPassword('');
      setPassword('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="p-4">
      <Text>{method.toUpperCase()}</Text>
      <TextInput
        placeholder="Username"
        className="border-2 border-teal-600"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder={error ? error : `Password`}
        className="border-2 border-teal-600 bg-teal-300"
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
      />
      {method === 'register' && (
        <TextInput
          placeholder={error ? error : 'Confirm Password'}
          placeholderClassName={`${error ? 'text-red-800' : 'text-blue-600'}`}
          className={`border-2 border-teal-600 bg-teal-300 `}
          secureTextEntry={true}
          onChangeText={setConfirmedPassword}
          value={confirmedPassword}
        />
      )}

      <Button
        title={`
        Click to ${method}
        `}
        onPress={async (e) => {
          e.preventDefault();
          if (!loading) await handleSubmit();
          // router.replace('/');
        }}></Button>
    </View>
  );
}
