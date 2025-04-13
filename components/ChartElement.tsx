import React from "react";
import { View, Dimensions, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import globalStyles from "@/app/styles";



const Chart = () => {
  const { width } = useWindowDimensions();
  return (
    <View style={styles.container}>
      <View style={styles.chartElementHeader}>
        <View style={{ alignItems: "flex-start" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: globalStyles.primaryText.color }}>Page View</Text>
          <Text style={{ fontSize: 10, fontWeight: "bold", maxWidth: 190, color: globalStyles.secondaryText.color }}>Last 30 days of portfolio trafic</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={{ fontSize: 10, fontWeight: "bold", color: globalStyles.backgroundColorSecondary.backgroundColor }}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={{ fontSize: 10, fontWeight: "bold", color: globalStyles.backgroundColorSecondary.backgroundColor }}>Unique</Text>
          </TouchableOpacity>
        </View>
      </View>

      <LineChart
        data={{
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "June", "July"],
          datasets: [
            {
              data: [20, 45, 28, 80, 99, 120], // Première courbe
              color: () => globalStyles.primaryColor.color, // Rouge
              strokeWidth: 4, // Épaisseur de la courbe
              
            },
            {
              data: [30, 60, 35, 90, 120], // Deuxième courbe
              color: (opacity = 0.8) => `rgba(54, 162, 235, ${opacity})`, // Bleu
              strokeWidth: 4, // Épaisseur de la courbe
            },
          ],
        }}
        width={width - 50}
        height={250}
        withDots={true} // Affiche les points sur les courbes
        withShadow={false} // Désactive l'ombre sous les courbes
        withInnerLines={true} // Enlève les lignes de grille internes
        withOuterLines={false} // Enlève les lignes de bordure
        bezier // Active les courbes lisses
        chartConfig={{
          backgroundGradientFrom: globalStyles.backgroundColorSecondary.backgroundColor,
          backgroundGradientTo: globalStyles.backgroundColorSecondary.backgroundColor,
          color: (opacity = 1) => `rgba(250, 240, 250, ${opacity})`,
          strokeWidth: 2, // Épaisseur de la ligne des axes
          decimalPlaces: 0, // Pas de décimales
        }}
        style={{
          marginVertical: 10,
          borderRadius: 10,
          padding: 5,
        }}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    borderWidth: globalStyles.boxBorderWidth.borderWidth,
    borderColor: globalStyles.quaternaryColorWithOpacity.color,
    borderRadius: globalStyles.boxBorderRadius.borderRadius,
    backgroundColor: globalStyles.backgroundColorSecondary.backgroundColor,
    padding: globalStyles.boxPadding.padding,
  },
  chartElementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    columnGap: 10,
  },
  button: {
    backgroundColor: globalStyles.primaryColor.color,
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 3,
  }
});

export default Chart;