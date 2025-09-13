import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '@/src/context/AppContext';
import ChatScreen from '@/src/screens/ChatScreen';

export default function HomeScreen() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <ChatScreen />
      </AppProvider>
    </SafeAreaProvider>
  );
}