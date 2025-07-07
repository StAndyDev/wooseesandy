import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import generateUserId from './generator';

export const sendUserToken = async (apiBaseUrl:string) => {
  if (!Device.isDevice) return;

  const getOrCreateUserId = async () => {
    let userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      userId = generateUserId();
      await AsyncStorage.setItem('userId', userId);
    }
    return userId;
  };

  const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') return null;

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  };

  const userId = await getOrCreateUserId();
  const token = await registerForPushNotificationsAsync();

  if (userId && token) {
    await fetch(apiBaseUrl + '/save-wooseeandy-user-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, expoPushToken: token }),
    });
  }
};