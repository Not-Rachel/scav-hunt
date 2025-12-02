import { Stack } from 'expo-router';
import { useState } from 'react';
import { AuthProvider, useAuth } from '../AuthContext';

const RootLayout = () => {
  const { isAuthorized } = useAuth();
  if (isAuthorized === null) {
    return null; // or splash/loading screen
  }
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthorized}>
        <Stack.Screen name="profile" />
        <Stack.Screen name="feed" />
        <Stack.Screen name="createPost" />
      </Stack.Protected>
    </Stack>
  );
};

export default RootLayout;
