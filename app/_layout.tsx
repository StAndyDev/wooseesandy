import { Stack } from 'expo-router';
import { Provider } from 'react-redux'
import { store } from '../store/store'

export default function Layout() {
  return (
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
  );
}