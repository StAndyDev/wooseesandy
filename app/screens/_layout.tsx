import { Stack } from 'expo-router';
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from 'react-native';
import globalStyles from '../styles';
import { useState } from 'react';

export default function Layout() {
    const [nbrNotif, setNbrNotif] = useState(3);
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: globalStyles.backgroundColorPrimary.backgroundColor },
                headerTintColor: globalStyles.primaryText.color, // Texte blanc
                headerTitleAlign: "left",
                headerTitle: () => (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{ alignItems: "flex-start" }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={{ fontSize: 18, fontWeight: "bold", color: globalStyles.primaryText.color }}>WooSeeAndy</Text>
                                {nbrNotif > 0 && (
                                    <TouchableOpacity onPress={() => alert(nbrNotif)}>
                                        <Text style={styles.notif}>{nbrNotif}</Text>
                                    </TouchableOpacity>
                                )}

                            </View>
                            <Text style={{ fontSize: 10, fontWeight: "bold", maxWidth: 190, color: globalStyles.secondaryText.color }}>View analytics from sitraka andy's portfolio</Text>
                        </View>
                    </View>
                ),

                headerRight: () => (
                    <View>
                        <TouchableOpacity
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
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
                            onPress={() => alert("Paramètres")}
                        >
                            <Ionicons name="sync" size={16} color={globalStyles.primaryColor.color} style={{ marginRight: 5 }} />
                            <Text style={{ color: globalStyles.primaryColor.color, fontSize: 16 }}>Refresh Data</Text>
                        </TouchableOpacity>
                    </View>
                ),
                // ITY ILAY MISY ERREUR
                // headerRight: () => (
                //     <View >
                //         <TouchableOpacity

                //             style={{
                //                 flexDirection: "row",
                //                 alignItems: "center",
                //                 backgroundColor: globalStyles.backgroundColorPrimary.backgroundColor,
                //                 paddingLeft: 10,
                //                 paddingRight: 10,
                //                 paddingTop: 5,
                //                 paddingBottom: 5,
                //                 borderRadius: 5,
                //                 borderWidth: 1,
                //                 borderColor: 'white',
                //             }}
                //             onPress={() => alert("Paramètres")}
                //         >   <Ionicons name="settings-outline" size={12} color="white" style={{ marginRight: 14 }} />
                //             <Text style={{ color: 'white', fontSize: 16 }}>Refresh Data</Text>
                //         </TouchableOpacity>
                //     </View>
                // ), // Icône de paramètres à droite

            }}
        >
            <Stack.Screen name="dashboard" />
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