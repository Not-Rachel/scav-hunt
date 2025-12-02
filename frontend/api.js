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

export async function apiFetch(endpoint, options = {}) {
  const baseURL =
    Platform.OS === 'android'
      ? process.env.EXPO_PUBLIC_ANDROID_URL
      : process.env.EXPO_PUBLIC_API_URL;

  const token = await AsyncStorage.getItem(ACCESS_TOKEN);

  const res = await fetch(`${baseURL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  // Throw on non-2xx responses
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errorText}`);
  }

  // Try to parse JSON, fallback to raw text
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
}

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
