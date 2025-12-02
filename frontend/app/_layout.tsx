import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import Nav from './components/Nav';
import { View } from 'react-native';
const LayoutStack = () => {
  const { isAuthorized } = useAuth();
  if (isAuthorized === undefined) {
    return null; // or splash/loading screen
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name={`users/[id]`} options={{ headerShown: false }} />
      <Stack.Protected guard={isAuthorized != null && !isAuthorized}>
        <Stack.Screen name="login" />
      </Stack.Protected>

      <Stack.Protected guard={isAuthorized != null && isAuthorized}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <LayoutStack />
      <Nav></Nav>
    </AuthProvider>
  );
}
