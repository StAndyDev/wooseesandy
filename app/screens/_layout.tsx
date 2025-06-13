import LogoSitrakaAndy from '@/components/logoStk';
import { Header } from '@react-navigation/elements';
import { Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import globalStyles from '../styles';
// redux
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
//
import { FontAwesome, Ionicons } from '@expo/vector-icons';

export default function Layout() {
    const router = useRouter();

    const visitinfo_unred_count = useSelector((state: RootState) => state.number_notification.unread.visitinfo_count)
    const cvdownload_unred_count = useSelector((state: RootState) => state.number_notification.unread.cvdownload_count)
    const portfoliodetailview_unred_count = useSelector((state: RootState) => state.number_notification.unread.portfoliodetailview_count)  

    return (
        <Stack
            screenOptions={{
                header: ({ options }) => (
                    <Header
                        {...options}
                        headerStyle={{
                            height: 80, // Définissez ici la hauteur du header
                            backgroundColor: globalStyles.backgroundColorPrimary.backgroundColor,
                        }}
                        title="WooSeeAndy" // Définissez explicitement le titre ici
                    />
                ),
                headerTintColor: globalStyles.primaryText.color,
                headerTitleAlign: 'left',
                headerTitle: () => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ alignItems: 'flex-start' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={styles.logoContent}><LogoSitrakaAndy width={80} height={20} /></View>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: globalStyles.primaryText.color }}>
                                    WooSeeAndy
                                </Text>
                            </View>
                            <Text style={{ fontSize: 10, fontWeight: 'bold', maxWidth: 190, color: globalStyles.secondaryText.color }}>
                                statistiques détaillées en temps réel sur les visiteurs et de leurs interactions
                            </Text>
                        </View>
                    </View>
                ),
                headerRight: () => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginRight: 15 }}>
                        <TouchableOpacity onPress={() => router.push('/Notification')}>
                            <View style={styles.container}>
                                <FontAwesome name="bell-o" size={22} color={globalStyles.secondaryText.color} />
                                {visitinfo_unred_count + cvdownload_unred_count + portfoliodetailview_unred_count > 0 && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>
                                            {visitinfo_unred_count + cvdownload_unred_count + portfoliodetailview_unred_count > 99 ? '99+' : visitinfo_unred_count + cvdownload_unred_count + portfoliodetailview_unred_count}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/Settings')}>
                            <Ionicons name="settings-outline" size={22} color={globalStyles.secondaryText.color} />
                        </TouchableOpacity>
                    </View>
                ),
                
            }}
        >
            <Stack.Screen name="Dashboard" />
        </Stack>
        
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 5,
    },
    logoContent: {
        backgroundColor: globalStyles.tertiaryColor.color,
        borderRadius: 25,
        borderWidth: 2,
        marginRight: 2,
        width: 30,
        height: 30,
        display: "flex",
        alignItems: "center",   
        justifyContent: "center",
    },
    badge: {
        position: 'absolute',
        right: 0,
        top: -2,
        backgroundColor: globalStyles.dangerColor.color,
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
