import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import globalStyles from "./styles";
import { TextSize } from "victory";

const notifications = [
  { id: "1", message: "Nouveau visiteur détecté", time: "Il y a 2 min" },
  { id: "2", message: "Visiteur récurrent identifié", time: "Il y a 10 min" },
  { id: "3", message: "Nouvelle connexion depuis un autre appareil", time: "Hier" },
];

const NotificationsScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={16} color={globalStyles.primaryColor.color} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications <Text>(3)</Text></Text>
      </View>
      
      {/* Description */}
      <Text style={styles.description}>
        Notifications pour afficher les nouveaux ou anciens visiteurs traqués
      </Text>

      {/* Liste des notifications */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationCard}>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.backgroundColorPrimary.backgroundColor,
    paddingHorizontal: globalStyles.boxPadding.padding,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    color: globalStyles.primaryText.color,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
  },
  description: {
    color: globalStyles.secondaryText.color,
    fontSize: 14,
    marginBottom: 20,
  },
  notificationCard: {
    backgroundColor: globalStyles.backgroundColorSecondary.backgroundColor,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  message: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  time: {
    color: "#888",
    fontSize: 12,
    marginTop: 5,
  },
});

export default NotificationsScreen;