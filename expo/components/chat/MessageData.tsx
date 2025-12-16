import { View, StyleSheet, Text, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export type DataProps = {
    temperature: string;
    unit: string;
    description: string;
    forecast: string[];
}

export const MessageData = ({ temperature, unit, description, forecast }: DataProps) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <View style={styles.card}>
            {/* Header: Date and Description */}
            <View style={styles.header}>
                <Text style={styles.dateText}>{today}</Text>
                <Text style={styles.conditionText}>{description}</Text>
            </View>

            {/* Main Temp and Icon */}
            <View style={styles.mainInfo}>
                <Text style={styles.mainTemp}>{temperature}°</Text>
                <Ionicons name="sunny" size={80} color="#FCE570" style={styles.mainIcon} />
            </View>

            {/* Hourly Forecast List */}
            <View style={styles.forecastWrapper}>
                <View style={styles.forecastLabels}>
                    <Text style={styles.forecastLabelText}>Hourly Forecast</Text>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.forecastContainer}
                >
                    {forecast.map((temp, index) => {
                        // Mocking time sequence starting from 7am as seen in the request image
                        // In a real app, this should come from data or be relative to current time
                        const time = `${7 + index}${index + 7 >= 12 ? 'pm' : 'am'}`;

                        return (
                            <View key={index} style={styles.forecastItem}>
                                <Text style={styles.forecastTime}>{time}</Text>
                                <Ionicons
                                    name={index < 3 ? "sunny" : "partly-sunny"}
                                    size={24}
                                    color={index < 3 ? "#FCE570" : "#E0E0E0"}
                                    style={styles.forecastIcon}
                                />
                                <Text style={styles.forecastTemp}>{temp}°</Text>
                            </View>
                        );
                    })}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#4dbbfb', // Sky blue similar to image
        borderRadius: 24,
        padding: 24,
        width: '100%',
        marginVertical: 10,
        // Shadow for depth
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    dateText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    conditionText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    mainInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        gap: 20,
    },
    mainTemp: {
        color: 'white',
        fontSize: 84, // Very large font for temp
        fontWeight: '300', // Light font weight
        letterSpacing: -2,
    },
    mainIcon: {
        marginTop: 10,
        marginLeft: 10,
    },
    forecastWrapper: {
        marginTop: 10,
    },
    forecastLabels: {
        marginBottom: 10,
    },
    forecastLabelText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        fontWeight: '600',
    },
    forecastContainer: {
        flexDirection: 'row',
        gap: 20,
        paddingBottom: 10, // Helper for scroll touch area
    },
    forecastItem: {
        alignItems: 'center',
        gap: 8,
    },
    forecastTime: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
    },
    forecastIcon: {
        // Icon styles
    },
    forecastTemp: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    }
});