import { View, StyleSheet, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from 'react-native';

export type ChartProps = {
    labels: string[];
    legend?: string[];
    datasets: {
        data: number[];
        color?: string;
        strokeWidth?: number;
        withDots?: boolean;
    }[];
}

export const MessageChart = ({ labels, datasets, legend }: ChartProps) => {
    const screenWidth = Dimensions.get('window').width / 1.4;
    const data = {
        labels,
        legend,
        datasets: datasets.map(d => ({
            data: d.data,
            color: (opacity = 1) => d.color || `rgba(0, 0, 0, ${opacity})`,
            strokeWidth: d.strokeWidth ?? 2,
            withDots: d.withDots ?? true
        }))
    };

    return (
        <View style={styles.container}>
            <LineChart
                data={data}
                width={screenWidth}
                height={280}
                yAxisLabel=""
                yAxisSuffix=""
                yAxisInterval={1}
                chartConfig={{
                    backgroundColor: "#ffffff",
                    backgroundGradientFrom: "#ffffff",
                    backgroundGradientTo: "#ffffff",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Grid and label color
                    labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
                    style: {
                        borderRadius: 16,
                        padding: -10
                    },
                    propsForDots: {
                        r: "0", // Hide dots by default like the image implies (lines are smooth)
                    },
                    propsForBackgroundLines: {
                        strokeDasharray: "", // Solid grid lines
                        stroke: "#e0e0e0"
                    }
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
                withDots={true} // Clean lines
                withInnerLines={true}
                withOuterLines={true}
                withVerticalLines={true}
                withHorizontalLines={true}
                withShadow={false}
                fromZero={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 0,
        marginVertical: 10,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    }
});