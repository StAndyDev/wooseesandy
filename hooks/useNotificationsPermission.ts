import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { Alert, Platform } from 'react-native';

export default function useNotificationsPermission() {
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync();

    // Ce handler s'exécute quand une notif arrive en foreground
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,     // Android
        shouldShowBanner: true,    // iOS (nouveau)
        shouldShowList: true,      // iOS (nouveau)
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });


    // Écoute quand une notif est reçue
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notif reçue en foreground', notification);
    });

    // Écoute quand l'utilisateur clique sur une notif
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notif cliquée', response);
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();

    };
  }, []);
}

// Appelle ça dans ton App.tsx ou autre composant principal
async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    Alert.alert('Tu dois utiliser un vrai téléphone pour recevoir les notifications');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert('Permission de notification refusée');
    return;
  }

  // Crée le canal Android avec son + vibration
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default', // sinon pas de son !
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  const token = tokenData.data;
  console.log('Expo Push Token:', token);
}
