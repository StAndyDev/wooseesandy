import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import globalStyles from '../app/styles';
import { WebSocketProvider } from '../contexts/WebSocketContext';
import { store } from '../store/store';

export default function Layout() {
  return (
    <Provider store={store}>
      <WebSocketProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: globalStyles.backgroundColorPrimary.backgroundColor }}>
          <StatusBar style="light"/>
          <Stack
            initialRouteName="index"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen
              name="index"
              options={{ animation: 'fade_from_bottom' }}
            />
            <Stack.Screen
              name="notification"
              options={{ animation: 'ios_from_right' }}
            />
            <Stack.Screen
              name="Settings"
              options={{ animation: 'ios_from_right' }}
            />

          </Stack>
        </SafeAreaView>
      </WebSocketProvider>
    </Provider>
  );
}