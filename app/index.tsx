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


export default function Index() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/screens/Dashboard"); // une ecran blanc affiche momentanement si on utilise <Redirect href="/screens/ashboard" />;
    }, 1200);
    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
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
        console.error('Erreur lors du chargement des base_urls:', e)
        return []
      }
    }

    // fetch : add to state Redux
    const fetchBaseUrl = async () => {
      const data = await loadBaseUrlData('base_urls')
      .then((urls) => 
        {
          dispatch(setUrl(urls));
        }
      );
    }

    fetchBaseUrl();
  }, []);

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