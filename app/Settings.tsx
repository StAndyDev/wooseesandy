import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import globalStyles from "./styles";

const Settings = () => {
    const [baseUrl, setBaseUrl] = useState('');
    const [webSocketUrl, setWebSocketUrl] = useState('');
    const navigation = useNavigation();

    const handleSave = () => {
        // Save settings logic here
        console.log('Base URL:', baseUrl);
        console.log('WebSocket URL:', webSocketUrl);
        alert('Settings saved successfully!');
    };

    return (
        <View style={styles.container}>
            <View style={styles.first_header}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={20} color={globalStyles.primaryColor.color} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Settings <Text>({0})</Text></Text>
                </View>
            </View>

            <Text style={styles.label}>Base URL:</Text>
            <TextInput
                style={styles.input}
                value={baseUrl}
                onChangeText={setBaseUrl}
                placeholder="Enter Base URL"
            />
            <Text style={styles.label}>WebSocket URL:</Text>
            <TextInput
                style={styles.input}
                value={webSocketUrl}
                onChangeText={setWebSocketUrl}
                placeholder="Enter WebSocket URL"
            />
            <Button title="Save Settings" onPress={handleSave} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: globalStyles.backgroundColorPrimary.backgroundColor,
        paddingHorizontal: globalStyles.boxPadding.padding,
    },
    first_header: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

    },
    title: {
        color: globalStyles.primaryText.color,
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
});

export default Settings;