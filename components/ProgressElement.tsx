import globalStyles from "@/app/styles";
import { useApiBaseUrl } from "@/hooks/useApiBaseUrl";
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";
import { getBrowserStats } from "../api/visitorsDataApi";

const ProgressRing = () => {
  let apiBaseUrl = useApiBaseUrl();
  const [visitorData, setVisitorData] = useState([
    { browser: "Chrome", percentage: 0, color: globalStyles.primaryColor.color },
    { browser: "Firefox", percentage: 0, color: globalStyles.secondaryColor.color },
    { browser: "Safari", percentage: 0, color: globalStyles.tertiaryColor.color },
    { browser: "Edge", percentage: 0, color: globalStyles.quaternaryColor.color },
    { browser: "Autres", percentage: 0, color: "#888888" },
  ]);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // permet de refraichir les données manuellement
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBrowserData = async () => {
      setLoading(true);
      try {
        const response = await getBrowserStats(apiBaseUrl);
        if (response.status === 200) {
          setVisitorData(prevData =>
            prevData.map(item => {
              const key = item.browser.toLowerCase();
              const newPercentage = response.data[key] !== undefined ? response.data[key] : 0;
              return { ...item, percentage: newPercentage };
            })
          );
        }
      } catch (error) {
        console.error("Error fetching browser stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBrowserData();
  }, [apiBaseUrl, refreshTrigger]);

  return (
    <View style={[styles.container, { alignItems: "center"}]}>
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 5 }}>
        <Text style={{ fontSize: 10, fontWeight: "bold", maxWidth: 190, color: globalStyles.secondaryText.color }}>Visiteurs par navigateur</Text>

        {loading ? <ActivityIndicator color={globalStyles.primaryColor.color} size="small" /> : <TouchableOpacity onPress={() => setRefreshTrigger(prev => prev + 1)}>
          <Ionicons name="sync" size={16} color={globalStyles.primaryColor.color} style={{ marginRight: 5 }} />
        </TouchableOpacity>}
      </View>

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
    flex: 1,
    borderWidth: globalStyles.boxBorderWidth.borderWidth,
    borderColor: globalStyles.quaternaryColorWithOpacity.color,
    borderRadius: globalStyles.boxBorderRadius.borderRadius,
    padding: globalStyles.boxPadding.padding,
  }
});

export default ProgressRing;