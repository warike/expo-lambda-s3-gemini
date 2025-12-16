import { View, StyleSheet, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";

export type DataProps = {
    labels: string[];
    datasets: {
        data: number[];
    }[];
}

export const MessageGDD = ({ labels, datasets }: DataProps) => {
    const screenWidth = Dimensions.get('window').width - 100;
    const data = {
        labels,
        datasets
    };
    return (
        <View style={styles.container}>
            <BarChart
                data={data}
                width={screenWidth}
                height={280}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                    backgroundColor: "#ffffff",

                    backgroundGradientFrom: "#ffffff",
                    backgroundGradientTo: "#ffffff",
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(60, 60, 60, ${opacity})`, // Dark grey for general elements
                    labelColor: (opacity = 1) => `rgba(120, 120, 120, ${opacity})`, // Light grey for text
                    barPercentage: 0.6,
                    fillShadowGradient: "#e0e0e0", // Light grey fill for bars
                    fillShadowGradientOpacity: 1,
                    propsForBackgroundLines: {
                        strokeDasharray: "4", // Dashed grid lines
                        stroke: "#e0e0e0"
                    }
                }}
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
                showBarTops={true}
                fromZero={true}
                withInnerLines={true}
                showValuesOnTopOfBars={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 10,
        marginVertical: 10,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    }
});