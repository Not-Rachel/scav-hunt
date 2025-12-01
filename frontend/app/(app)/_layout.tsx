import { Stack } from 'expo-router';
import { useState } from 'react';

const RootLayout = () => {
  const [isAuthorized, setIsAuthorized] = useState(true);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthorized}>
        <Stack.Screen name="profile" />
      </Stack.Protected>
    </Stack>
  );
};

export default RootLayout;
