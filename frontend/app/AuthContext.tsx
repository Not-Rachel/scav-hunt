import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';
import { jwtDecode } from 'jwt-decode';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
// AuthContext.tsx
type AuthContextType = {
  isAuthorized: boolean | null;
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean | null>>;
  setUser: React.Dispatch<React.SetStateAction<number | null>>;
  user: number | null;
  auth: () => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [user, setUser] = useState<number | null>(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  const refreshToken = async () => {
    const refresh_token = await AsyncStorage.getItem(REFRESH_TOKEN);
    try {
      const response = await api.post('/api/token/refresh/', { refresh: refresh_token });
      if (response.status === 200) {
        await AsyncStorage.setItem(ACCESS_TOKEN, response.data.access);
        setIsAuthorized(true);
        console.log(response.data);

        const decoded: any = jwtDecode(response.data.access);
        console.log('REFRESH', decoded);
        setUser(decoded.user_id);
      } else setIsAuthorized(false);
    } catch (error) {
      console.error(Error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = await AsyncStorage.getItem(ACCESS_TOKEN);
    // console.log(token);
    if (!token) {
      setIsAuthorized(false);
      setUser(null);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExp = decoded.exp;
    const now = Date.now() / 1000;
    if (tokenExp < now) await refreshToken();
    else {
      console.log('AUTH', decoded);
      setIsAuthorized(true);
      setUser(decoded.user_id);
    }
  };

  if (isAuthorized === null) {
    console.log('Loading...');
  }

  async function logout() {
    await AsyncStorage.removeItem(ACCESS_TOKEN);
    await AsyncStorage.removeItem(REFRESH_TOKEN);
    setIsAuthorized(false);
  }

  async function RegisterAndLogOut() {
    await AsyncStorage.removeItem(ACCESS_TOKEN);
    await AsyncStorage.removeItem(REFRESH_TOKEN);
    setIsAuthorized(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthorized, setIsAuthorized, user, setUser, auth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
