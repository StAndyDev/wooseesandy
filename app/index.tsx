import LogoSitrakaAndy from "@/components/logoStk";
import AsyncStorage from '@react-native-async-storage/async-storage'; // storage asynchrone
import { useRouter } from "expo-router";
import { AnimatePresence, MotiText, MotiView } from 'moti';
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import globalStyles from './styles';
// redux
import { useDispatch } from 'react-redux';
import { setUrl } from '../features/baseUrlConfigSlice';
// hook
import { useTestConnection } from "@/hooks/useTestConnection";

import useNotificationsPermission from "@/hooks/useNotificationsPermission";
import { Easing } from 'react-native-reanimated';


export default function Index() {
  useNotificationsPermission(); // hook pour les permissions de notifications
  const router = useRouter();
  const dispatch = useDispatch();

  // test de connexion à l'API
  const { checkApiConnection } = useTestConnection();
  const [showLogo, setShowLogo] = useState(true); // ici

useEffect(() => {
  const init = async () => {
    await fetchBaseUrl(); // attendre que le state Redux soit bien rempli
    await testConnection(); // puis tester la connexion
    setTimeout(() => {
      setShowLogo(false);
    }, 4400);
    redirectToDashboard();
  };

  init(); // appel immédiat de la fonction async interne
}, [checkApiConnection]);

  // Chargement des données de l'URL de base depuis AsyncStorage
  const loadBaseUrlData = async (key: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      if (jsonValue != null && jsonValue !== '[]') {
        return JSON.parse(jsonValue)
      } else {
        const defaultUrl = [
          {
            id: 1,
            isActiveForApi: true,
            isActiveForWs: false,
            protocole: "https",
            host: "wooseeandy-backend.onrender.com",
            port: null,
          },
          {
            id: 2,
            isActiveForApi: false,
            isActiveForWs: true,
            protocole: "wss",
            host: "wooseeandy-backend.onrender.com",
            port: null,
          }
        ];
        await AsyncStorage.setItem(key, JSON.stringify(defaultUrl))
        return defaultUrl;
      }
    } catch (e) {
      console.error('Erreur lors du chargement des paramètres de connexion :', e)
      return []
    }
  }

  // fetch : add to state Redux
  const fetchBaseUrl = async () => {
    const urls = await loadBaseUrlData('base_urls');
    dispatch(setUrl(urls));
  };

  // redirection vers l'écran Dashboard après qlq secondes
  const redirectToDashboard = async () => {
    const timer = setTimeout(() => {
      router.replace("/screens/dashboard"); // une ecran blanc affiche momentanement si on utilise <Redirect href="/screens/dashboard" />;
    }, 4500);
    return () => clearTimeout(timer);
  }

  // Vérification de la connexion à l'API
  const testConnection = async () => {
    const isConnected = await checkApiConnection();
    if (isConnected) {
      console.log('Connexion à l\'API réussie :' + isConnected);
    } else {
      console.log('Échec de la connexion à l\'API :' + isConnected);
    }
  };

  return (
    <SafeAreaView style={[styles.container, globalStyles.backgroundColorPrimary]}>
      <View style={styles.content}>
        <MotiText
          from={{ translateY: -20 }}
          animate={{ translateY: 0 }}
          transition={{
            translateY: {
              type: 'spring',
              damping: 10,
              mass: 1,
            },
          }}
          style={styles.text}
        >
          <Text>Wooseeandy</Text>
          <Text style={styles.textSubtitle}> v.1.0</Text>

        </MotiText>


        <View style={{ alignItems: "center", marginTop: 10 }}>
          <AnimatePresence>
            {showLogo && (
              <MotiView
                from={{
                  opacity: 0,
                  scale: 0.5,
                  translateY: -40,
                  rotateZ: '-5deg',
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  translateY: 0,
                  rotateZ: '0deg',
                }}
                exit={{
                  opacity: 0.5,
                  scale: 3.2,
                  rotateZ: '5deg',
                }}
                transition={{
                  // Entrée rapide et fluide
                  animate: {
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    mass: 0.8,
                  },
                  // Sortie retardée, lente et élégante
                  exit: {
                    type: 'timing',
                    duration: 2000,
                    delay: 600,
                    easing: Easing.out(Easing.cubic),
                  },
                }}
              >
                <LogoSitrakaAndy width={140} height={100} />
              </MotiView>
            )}
          </AnimatePresence>
          <Text style={styles.textSubtitle}>
            Solution professionnelle de tracking et d'analyse des visiteurs de portfolio de sitraka andy
          </Text>
        </View>



      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 24,
  },
  textSubtitle: {
    width: 250,
    textAlign: "center",
    color: "white",
    fontSize: 10,
  }
});