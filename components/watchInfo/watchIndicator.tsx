import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleSheet, useColorScheme, View, ViewProps } from 'react-native';
import { ThemedText } from '../themed-text';

const getColor = (colorScheme: any) => {
    return colorScheme === "dark" ? "white" : "black"
}

export type WatchIndicatorProps = ViewProps & {
  isConnected?: boolean;
};

const WatchIndicator = ({ isConnected }: WatchIndicatorProps) => {
    const colorScheme = useColorScheme()
    const color = getColor(colorScheme)

  return (
    <View style={styles.container}>
        {isConnected ? (
            <MaterialIcons name="bluetooth-connected" size={21} color={color} />
        ) : (
            <MaterialIcons name="bluetooth-disabled" size={21} color={color} />
        )}
        <ThemedText style={{ marginRight: 5 }}>{isConnected ? "Connected" : "Disconnected"}</ThemedText>
        <ThemedText>•</ThemedText>
        <MaterialIcons name="battery-full" size={20} color={color} />
        <ThemedText style={{ marginRight: 5 }}>{isConnected ? "100%" : "unknown" }</ThemedText>
        <ThemedText>•</ThemedText>
        <Ionicons name="notifications-off-outline" size={19} color={color} />

    </View>
  )
}

export default WatchIndicator

const styles = StyleSheet.create({
    container: {
        width: "50%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

    }
})