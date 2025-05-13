import { Ionicons } from '@expo/vector-icons';
import { Header } from '@react-navigation/elements';
import { Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import globalStyles from '../styles';
// redux
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

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
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: globalStyles.primaryText.color }}>
                                    WooSeeAndy
                                </Text>
                                {(visitinfo_unred_count + cvdownload_unred_count + portfoliodetailview_unred_count) > 0 && (
                                    <TouchableOpacity onPress={() => router.push('/Notification')}>
                                        <Text style={styles.notif}>{visitinfo_unred_count + cvdownload_unred_count + portfoliodetailview_unred_count}</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            <Text style={{ fontSize: 10, fontWeight: 'bold', maxWidth: 190, color: globalStyles.secondaryText.color }}>
                                Voir les statistiques du portfolio de Sitraka Andy
                            </Text>
                        </View>
                    </View>
                ),
                headerRight: () => (
                    <View>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: globalStyles.backgroundColorPrimary.backgroundColor,
                                marginRight: 5,
                                paddingLeft: 10,
                                paddingRight: 10,
                                paddingTop: 5,
                                paddingBottom: 5,
                                borderRadius: 5,
                                borderWidth: 1,
                                borderColor: globalStyles.primaryColor.color,
                            }}
                            onPress={() => alert('refresh')}
                        >
                            <Ionicons name="sync" size={16} color={globalStyles.primaryColor.color} style={{ marginRight: 5 }} />
                            <Text style={{ color: globalStyles.primaryColor.color, fontSize: 16 }}>Rafraîchir</Text>
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
    notif: {
        marginLeft: 2,
        marginBottom: 14,
        paddingLeft: 6,
        paddingRight: 6,
        paddingTop: 2,
        paddingBottom: 2,
        borderRadius: 50,
        fontSize: 10,
        color: 'white',
        backgroundColor: 'rgb(230, 11, 122)',
    },
});
