import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack 
    initialRouteName="index" 
    screenOptions={{ 
      headerShown: false,
    }}
    >
      <Stack.Screen name="index" options={{
          animation: 'fade_from_bottom',
        }}/>
      <Stack.Screen name="notification" options={{
          animation: 'ios_from_right',
        }}/>
    </Stack>
  );
}