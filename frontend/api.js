import axios from 'axios';
import { ACCESS_TOKEN } from 'constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
// import { loadEnv } from '@expo/env';
// loadEnv(); // populates process.env
const api = axios.create({
  baseURL:
    Platform.OS === 'android'
      ? process.env.EXPO_PUBLIC_ANDROID_URL
      : process.env.EXPO_PUBLIC_API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
