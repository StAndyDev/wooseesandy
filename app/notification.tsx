import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

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
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
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
    backgroundColor: "#121212",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 15,
  },
  description: {
    color: "#bbb",
    fontSize: 14,
    marginBottom: 20,
  },
  notificationCard: {
    backgroundColor: "#1e1e1e",
    padding: 15,
    borderRadius: 10,
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