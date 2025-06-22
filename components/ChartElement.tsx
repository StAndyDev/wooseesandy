import globalStyles from "@/app/styles";
import { useApiBaseUrl } from "@/hooks/useApiBaseUrl";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { getSevenLastCVDownloadStats, getSevenLastPortfolioDetailViewStats, getSevenLastVisitInfoStats } from "../services/backend";

const Chart = () => {
  let apiBaseUrl = useApiBaseUrl();
  const { width } = useWindowDimensions();
  const [timeFrame, setTimeFrame] = useState<'month' | 'week'>('month');
  const [chartData, setChartData] = useState({
    labels: [''],
    visitInfoData: [0],
    cvDownloadData: [0],
    portfolioDetailsData: [0],
  });
  const [loadingChartData, setLoadingChartData] = useState(true);

  useEffect(() =>{
    const fetchData = async () => {
      try {
        setLoadingChartData(true);
        const visitInfoResponse = await getSevenLastVisitInfoStats(apiBaseUrl, timeFrame);
        const cvDownloadResponse = await getSevenLastCVDownloadStats(apiBaseUrl, timeFrame);
        const portfolioDetailsResponse = await getSevenLastPortfolioDetailViewStats(apiBaseUrl, timeFrame);

        if(visitInfoResponse.status === 200 || cvDownloadResponse.status === 200 || portfolioDetailsResponse.status === 200) {
          setChartData({
            labels: visitInfoResponse.data.labels,
            visitInfoData: visitInfoResponse.data.visit_info,
            cvDownloadData: cvDownloadResponse.data.cv_download,
            portfolioDetailsData: portfolioDetailsResponse.data.portfolio_detail_view,
          });
          setLoadingChartData(false);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
        return;
      }
    };

    fetchData();
  },[apiBaseUrl, timeFrame]);

  return (
    <View style={styles.container}>
      <View style={styles.chartElementHeader}>
        <View style={{ alignItems: "flex-start" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: globalStyles.primaryText.color }}>Visiteurs</Text>
          <Text style={{ fontSize: 10, fontWeight: "bold", maxWidth: 190, color: globalStyles.secondaryText.color }}>Trafic des 7 derniers {timeFrame === "month"? "mois" : "semaine" }</Text>
        </View>
        <View style={styles.buttonContainer}>
          {loadingChartData && <ActivityIndicator color={globalStyles.secondaryText.color} size="small" />}
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
        width={width - 72}
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
          propsForLabels: {
            fontSize: 8 // labels size
          }
        }}
        style={{
          marginVertical: 10,
          borderRadius: 10,
          padding: 5,
        }}
      />

      {/* legende */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 }}>
          <View style={{ width: 10, height: 10, backgroundColor: globalStyles.primaryColor.color, marginRight: 4 }} />
          <Text style={{ fontSize: 10, color: 'white' }}>Visites</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 }}>
          <View style={{ width: 10, height: 10, backgroundColor: globalStyles.secondaryText.color, marginRight: 4 }} />
          <Text style={{ fontSize: 10, color: 'white' }}>Téléchargements</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 }}>
          <View style={{ width: 10, height: 10, backgroundColor: globalStyles.tertiaryColor.color, marginRight: 4 }} />
          <Text style={{ fontSize: 10, color: 'white' }}>Portfolio view</Text>
        </View>
      </View>
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