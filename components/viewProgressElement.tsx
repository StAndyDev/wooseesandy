import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";
import globalStyles from "@/app/styles";

const visitorData = [
  { browser: "Chrome", percentage: 50, color: globalStyles.primaryColor.color },
  { browser: "Firefox", percentage: 20, color: globalStyles.secondaryColor.color },
  { browser: "Safari", percentage: 15, color: globalStyles.tertiaryColor.color },
  { browser: "Edge", percentage: 10, color: globalStyles.quaternaryColor.color },
  { browser: "Autres", percentage: 5, color: "#888888" },
];

const ProgressRing = () => {
  return (
    <View style={[styles.container, { alignItems: "center"}]}>
      <Text style={{ fontSize: 10, fontWeight: "bold", maxWidth: 190, color: globalStyles.secondaryText.color }}>Visiteurs par navigateur</Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 20 }}>
        {visitorData.map((item, index) => (
          <View key={index} style={{ alignItems: "center", margin: 10 }}>
            <CircularProgress
              value={item.percentage}
              radius={40}
              duration={2500}
              progressValueColor={globalStyles.secondaryText.color}
              activeStrokeColor={item.color}
              inActiveStrokeColor="#eee"
              inActiveStrokeOpacity={0.3}
              inActiveStrokeWidth={8}
              activeStrokeWidth={10}
            />
            <Text style={{ fontSize: 10, fontWeight: "bold", maxWidth: 190, color: globalStyles.secondaryText.color }}>{item.browser}</Text>
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
    padding: globalStyles.boxPadding.padding,
  }
});

export default ProgressRing;