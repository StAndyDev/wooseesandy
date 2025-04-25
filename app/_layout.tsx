import { Stack } from 'expo-router';
import { Provider } from 'react-redux'
import { store } from '../store/store'
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import globalStyles from '../app/styles';

export default function Layout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: globalStyles.backgroundColorPrimary.backgroundColor }}>
    <StatusBar style="light" backgroundColor={globalStyles.quaternaryColor.color} />
    <Provider store={store}>
    <Stack 
    initialRouteName="index"
    screenOptions={{ 
      headerShown: false,
    }}
    >
      <Stack.Screen name="index" options={{
          animation: 'fade_from_bottom',
        }}/>
      <Stack.Screen name="Notification" options={{
          animation: 'ios_from_right',
        }}/>
    </Stack>
    </Provider>
    </SafeAreaView>
  );
}