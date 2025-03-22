import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";
import globalStyles from "@/app/styles";

const visitorData = [
  { browser: "Chrome", percentage: 50, color: "#FF5733" },
  { browser: "Firefox", percentage: 20, color: "#FFB533" },
  { browser: "Safari", percentage: 15, color: "#33A8FF" },
  { browser: "Edge", percentage: 10, color: "#33FF77" },
  { browser: "Autres", percentage: 5, color: "#888888" },
];

const ProgressRing = () => {
  return (
    <View style={[styles.container, { alignItems: "center", marginTop: 50 }]}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Visiteurs par navigateur</Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 20 }}>
        {visitorData.map((item, index) => (
          <View key={index} style={{ alignItems: "center", margin: 10 }}>
            <CircularProgress
              value={item.percentage}
              radius={40}
              duration={1500}
              progressValueColor={"#000"}
              activeStrokeColor={item.color}
              inActiveStrokeColor="#eee"
              inActiveStrokeOpacity={0.3}
              inActiveStrokeWidth={8}
              activeStrokeWidth={10}
            />
            <Text style={{ marginTop: 5, fontSize: 14 }}>{item.browser}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    borderWidth: globalStyles.boxBorderWidth.borderWidth,
    borderColor: globalStyles.quaternaryColorWithOpacity.color,
    borderRadius: globalStyles.boxBorderRadius.borderRadius,
  }
});

export default ProgressRing;