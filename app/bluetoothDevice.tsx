import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ThemedTile from '@/components/themedTile';
import useBLE from '@/hooks/useBle';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Switch } from 'react-native-paper';


const BluetoothDevice = () => {
  const { connectedDevice, allDevices, isBluetoothOn, stopScanPeripherals, scanForPeripherals, requestPermissions } = useBLE();

  const [bluetoothEnable, setBluetoothEnable] = useState(false);

  const scanToggle = async () => {
    if(!isBluetoothOn) {
      await requestPermissions();
      scanForPeripherals();
      return;
    }

    stopScanPeripherals();
  }

  return (
    <ThemedView style={styles.container}>
      <View style={{
        paddingVertical: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderColor: "#2c2c2c88"
        // backgroundColor: "brown",
      }}>
        <ThemedText>Bluetooth</ThemedText>
        <Switch 
        value={isBluetoothOn}
        onValueChange={scanToggle}
        style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
        color='#1077d8ff'

        />
      </View>
      <View style={styles.deviceContainer}>
        <ThemedText>No device detected, please turn on bluetooth</ThemedText>
        <ThemedTile style={styles.deviceItem}>
          <View style={{ width: "90%"}}>
            <ThemedText type="defaultSemiBold" style={styles.deviceName}>Esp32</ThemedText>
            <ThemedText type="small" style={styles.deviceStatus}>Saved</ThemedText>
          </View>
          <View style={{ width: "10%", justifyContent: "center"}}>
            <View style={{ backgroundColor: "#555555ff", padding: 13, paddingLeft: 16, borderRadius: 90}}>
            <FontAwesome6 name="angle-right" size={15} color="#c2c2c2ff" />
            </View>
          </View>
        </ThemedTile>
        <ThemedTile style={styles.deviceItem}>
          <View style={{ width: "90%"}}>
            <ThemedText type="defaultSemiBold" style={styles.deviceName}>Esp32</ThemedText>
            <ThemedText type="small" style={styles.deviceStatus}>Saved</ThemedText>
          </View>
          <View style={{ width: "10%", justifyContent: "center"}}>
            <View style={{ backgroundColor: "#555555ff", padding: 13, paddingLeft: 16, borderRadius: 90}}>
            <FontAwesome6 name="angle-right" size={15} color="#c2c2c2ff" />
            </View>
          </View>
        </ThemedTile>
        <ThemedTile style={styles.deviceItem}>
          <View style={{ width: "90%"}}>
            <ThemedText type="defaultSemiBold" style={styles.deviceName}>Esp32</ThemedText>
            <ThemedText type="small" style={styles.deviceStatus}>Saved</ThemedText>
          </View>
          <View style={{ width: "10%", justifyContent: "center"}}>
            <View style={{ backgroundColor: "#555555ff", padding: 13, paddingLeft: 16, borderRadius: 90}}>
            <FontAwesome6 name="angle-right" size={15} color="#c2c2c2ff" />
            </View>
          </View>
        </ThemedTile>
        <ThemedTile style={styles.deviceItem}>
          <View style={{ width: "90%"}}>
            <ThemedText type="defaultSemiBold" style={styles.deviceName}>Esp32</ThemedText>
            <ThemedText type="small" style={styles.deviceStatus}>Saved</ThemedText>
          </View>
          <View style={{ width: "10%", justifyContent: "center"}}>
            <View style={{ backgroundColor: "#555555ff", padding: 13, paddingLeft: 16, borderRadius: 90}}>
            <FontAwesome6 name="angle-right" size={15} color="#c2c2c2ff" />
            </View>
          </View>
        </ThemedTile>
      </View>
    </ThemedView>
  )
}

export default BluetoothDevice

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
  },
  deviceContainer: {
    flex: 1,
    paddingTop: 20,
    gap: 10,
  },
  deviceItem: {
    height: 70,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    // backgroundColor: "brown"
  },
  deviceName: {

  },
  deviceStatus: {

  }
})