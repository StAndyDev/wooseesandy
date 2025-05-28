import globalStyles from "@/app/styles";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

const Chart = () => {
  const { width } = useWindowDimensions();
  const [timeFrame, setTimeFrame] = React.useState<'month' | 'week'>('month');
  const [chartData, setChartData] = React.useState({
    labels: [''],
    visitInfoData: [20, 45, 28, 80, 99, 120],
    cvDownloadData: [30, 60, 35, 90, 120],
    portfolioDetailsData: [10, 50, 40, 70, 110],
  });

  useEffect(() =>{
    const BASE_URL = 'http://localhost:8000/api';
    const fetchData = async () => {
      try {
        const [visitInfoResponse, cvDownloadResponse, portfolioDetailsResponse] = await Promise.all([
          fetch(`${BASE_URL}/seven-last-visit-info/stats/?mode=${timeFrame}`),
          fetch(`${BASE_URL}/seven-last-cv-download/stats/?mode=${timeFrame}`),
          fetch(`${BASE_URL}/seven-last-portfolio-detail/stats/?mode=${timeFrame}`),
        ]);

        const visitInfoJson = await visitInfoResponse.json();
        // const visitInfoData = visitInfoJson.data.map((item: { count: number }) => item.count);
        console.log("XXXXXXXXXXXXXX :"+visitInfoJson.data);
        // const cvDownloadData = await cvDownloadResponse.json();
        // const portfolioDetailsData = await portfolioDetailsResponse.json();

        // setChartData({
        //   labels: timeFrame === "month"? chartData.labels : ['s1', 's2', 's3', 's4', 's5', 's6', 's7'],
        //   visitInfoData: visitInfoData.data,
        //   cvDownloadData: cvDownloadData.data,
        //   portfolioDetailsData: portfolioDetailsData.data,
        // });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  },[timeFrame]);

  return (
    <View style={styles.container}>
      <View style={styles.chartElementHeader}>
        <View style={{ alignItems: "flex-start" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: globalStyles.primaryText.color }}>Visiteurs</Text>
          <Text style={{ fontSize: 10, fontWeight: "bold", maxWidth: 190, color: globalStyles.secondaryText.color }}>Trafic des 7 derniers {timeFrame === "month"? "mois" : "semaine" }</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={timeFrame === "month"? styles.buttonActive : styles.button} onPress={() => setTimeFrame("month")}>
            <Text 
            style={{ 
              fontSize: 10,
              fontWeight: "bold", 
              color: timeFrame === "month" ? globalStyles.backgroundColorSecondary.backgroundColor : globalStyles.secondaryText.color
            }
              }>Mois</Text>
          </TouchableOpacity>
          <TouchableOpacity style={timeFrame === "week"? styles.buttonActive : styles.button} onPress={() => setTimeFrame("week")}>
            <Text style={{ 
              fontSize: 10, 
              fontWeight: "bold", 
              color: timeFrame === "week" ? globalStyles.backgroundColorSecondary.backgroundColor : globalStyles.secondaryText.color
              }}>Semaine</Text>
          </TouchableOpacity>
        </View>
      </View>

      <LineChart
        data={{
          labels: chartData.labels,
          legend: ['Visites', 'Téléchargements', 'Consultations'],
          datasets: [
            {
              data: chartData.visitInfoData, // Première courbe : visit info
              color: () => globalStyles.primaryColor.color,
              strokeWidth: 4, // Épaisseur de la courbe
              
            },
            {
              data: chartData.cvDownloadData, // Deuxième courbe : cv download
              color: () => globalStyles.secondaryText.color,
              strokeWidth: 4, // Épaisseur de la courbe
            },
            {
              data: chartData.portfolioDetailsData, // Troisième courbe : portfolio details view
              color: () => globalStyles.tertiaryColor.color,
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
  buttonActive: {
    backgroundColor: globalStyles.primaryColor.color,
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 3,
  },
  button : {
    borderWidth: globalStyles.boxBorderWidth.borderWidth,
    borderColor: globalStyles.primaryColor.color,
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 3,
  }
});

export default Chart;