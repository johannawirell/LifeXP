import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';

import { SessionProvider, useSession } from '@/context/session-context';

function RootNavigator() {
  const { isHydrating } = useSession();

  if (isHydrating) {
    return (
      <View style={{ alignItems: 'center', backgroundColor: '#090E16', flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#A866FF" />
      </View>
    );
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  return (
    <SessionProvider>
      <RootNavigator />
    </SessionProvider>
  );
}
