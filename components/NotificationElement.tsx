import React from "react";
import { View, Text, StyleSheet } from "react-native";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../redux/store";
// import { removeNotification } from "../redux/notificationsSlice";

const Notifications = () => {
//   const notifications = useSelector((state: RootState) => state.notifications);
    const [notifications, setNotifications] = React.useState([ {id: '2', message: 'hello'}, {id: '3', message:'word'} ]);
//   const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      {notifications.map((notif) => (
        <View key={notif.id} style={styles.notification}>
          <Text>{notif.message}</Text>
          {/* <Text onPress={() => dispatch(removeNotification(notif.id))}>❌</Text> */}
          <Text>❌</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  notification: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
});

export default Notifications;