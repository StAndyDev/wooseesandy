import LogoSitrakaAndy from "@/components/logoStk";
import AsyncStorage from '@react-native-async-storage/async-storage'; // storage asynchrone
import { useRouter } from "expo-router";
import { MotiText, MotiView } from 'moti';
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import globalStyles from './styles';
// redux
import { useDispatch } from 'react-redux';
import { setUrl } from '../features/baseUrlConfigSlice';
// hook
import { useTestConnection } from "@/hooks/useTestConnection";
// create or get user id
// expo notif

export default function Index() {

  const router = useRouter();
  const dispatch = useDispatch();

  // test de connexion à l'API
  const { checkApiConnection } = useTestConnection();

  useEffect(() => {
    fetchBaseUrl();
    testConnection();
    redirectToDashboard();
  }, [checkApiConnection]);

  // Chargement des données de l'URL de base depuis AsyncStorage
  const loadBaseUrlData = async (key: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      if (jsonValue != null) {
        return JSON.parse(jsonValue)
      } else {
        await AsyncStorage.setItem(key, JSON.stringify([]))
        return []
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

  // redirection vers l'écran Dashboard après 11.3 secondes
  const redirectToDashboard = async () => {
    const timer = setTimeout(() => {
      router.replace("/screens/dashboard"); // une ecran blanc affiche momentanement si on utilise <Redirect href="/screens/dashboard" />;
    }, 1500);
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
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            translateY: {
              type: 'spring',
              damping: 10,
              mass: 1,
            },
          }}
        >
          <View style={{ alignItems: "center", marginTop: 10 }}>
            <LogoSitrakaAndy width={140} height={100} />
            <Text style={styles.textSubtitle}>Solution professionnelle de tracking et d'analyse des visiteurs de portfolio de sitraka andy</Text>
          </View>

        </MotiView>

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