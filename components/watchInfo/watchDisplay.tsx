import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

export type WatchDisplayProps = ViewProps & {
  isConnected?: boolean;
};

const WatchDisplay = ({ isConnected }: WatchDisplayProps) => {
  return (
    (isConnected === true) ? (
        <ThemedView style={styles.container}>
            <View>
                <ThemedText type='defaultSemiBold' style={{ opacity: 0.8}}>Saturday 28</ThemedText>
                <ThemedText type='time'>07:28</ThemedText>
            </View>
            <View style={[styles.row, { 
                width: "100%",
                justifyContent: "space-between"
            }]}>
                <ThemedText>28°</ThemedText>
                <View style={[styles.row, { gap: 5 }]}>
                    <FontAwesome5 name="bluetooth-b" size={12} color="white" />
                    <Feather name="menu" size={15} color="white" />
                </View>
            </View>
        </ThemedView>
    ) : (
        <ThemedView style={[styles.container, { alignItems: "center", justifyContent: "center", gap: 10 }]}>
            <ThemedText type="time" >404</ThemedText>
            <FontAwesome5 name="sad-cry" size={60} color="white" />
        </ThemedView>
    )
  )
}

export default WatchDisplay

const styles = StyleSheet.create({
    container: {
        width: 200,
        height: 210,
        borderRadius: 15,
        padding: 20,

        justifyContent: 'space-between',
        backgroundColor: "#060707ff",
        shadowColor: 'rgba(230, 235, 249, 0.42)',
        shadowRadius: 40,
        elevation: 40
    },
    row: {
        flexDirection: "row",
        alignItems: 'center',
    }
})