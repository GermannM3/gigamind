/**
 * GigaMind Mobile App
 * https://github.com/GermannM3/gigamind
 *
 * @format
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import ChatScreen from './src/screens/ChatScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <ChatScreen />
      </AppProvider>
    </SafeAreaProvider>
  );
}