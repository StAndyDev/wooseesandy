import globalStyles from "@/app/styles";
import React from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

interface HistogramProps {
    data: {
        page: string;
        visites: number;
    }[];
}

const Histogram: React.FC<HistogramProps> = ({ data }) => {
    const { width } = useWindowDimensions();

    const labels = data.map(item => item.page);
    const values = data.map(item => item.visites);

    return (
        <View style={styles.container}>
            <View style={styles.headerHistogram}>
                <Text style={styles.title}>Portfolio Visités</Text>
                <Text style={styles.subtitle}>Nombre de chaque section</Text>
            </View>
            <BarChart
                data={{
                    labels,
                    datasets: [{ data: values }]
                }}
                width={width - 40}
                height={300}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                    decimalPlaces: 0,
                    color: () => globalStyles.secondaryColorWithOpacity.color,
                    labelColor: () => globalStyles.primaryText.color,
                    style: { borderRadius: 16 },
                    propsForBackgroundLines: {
                        strokeDasharray: "5",
                    },
                }}
                verticalLabelRotation={data.length*2.5}
                style={styles.chart}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: globalStyles.boxBorderWidth.borderWidth,
        borderColor: globalStyles.quaternaryColorWithOpacity.color,
        borderRadius: globalStyles.boxBorderRadius.borderRadius,
        padding: globalStyles.boxPadding.padding,
    },
    headerHistogram: {
        display: "flex",
        flexDirection: "column",
        paddingBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
    },
    subtitle: {
        fontSize: 10,
        fontWeight: "bold",
        color: globalStyles.secondaryText.color,
    },
    chart: {
        borderRadius: 15,
    },
});

export default Histogram;