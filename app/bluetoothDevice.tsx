import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import ThemedTile from "@/components/themedTile";
import useBLE from "@/hooks/useBle";
import { useBLEStore } from "@/store/useBLEStore";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React, { FC, useCallback, useEffect } from "react";
import {
  ListRenderItemInfo,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView
} from "react-native";
import { Device } from "react-native-ble-plx";
import { Switch } from "react-native-paper";

type DeviceListItemProps = {
  item: ListRenderItemInfo<Device>;
  connectToPeripheral: (device: Device) => void;
  closeModal: () => void;
};

const DeviceListItem: FC<DeviceListItemProps> = (props) => {
  const { item, connectToPeripheral, closeModal } = props;
  const connectedDevice = useBLEStore((s) => s.connectedDevice)

  const connectAndClose = useCallback(() => {
    connectToPeripheral(item.item);
    console.log("connect to:", item.item)
  }, [closeModal, connectToPeripheral, item.item]);

  const getStatus = () => {
    if (!connectedDevice) {
      return ""
    }

    if (connectedDevice.id === item.item.id) {
      return "Connected"
    }
  }

  return (
    <ThemedTile onPress={connectAndClose} style={styles.deviceItem}>
        <View style={{ width: "90%" }}>
          <ThemedText type="default" style={styles.deviceName}>
            {item.item.name || "unknown"}
        </ThemedText>
        <ThemedText type="small" style={{ opacity: 0.7}}>{getStatus()}</ThemedText>
        </View>
        <View style={{ width: "10%", justifyContent: "center" }}>
          <View
            style={{
              backgroundColor: "#555555ff",
              padding: 13,
              paddingLeft: 16,
              borderRadius: 90,
            }}
          >
            <FontAwesome6 name="angle-right" size={15} color="#c2c2c2ff" />
          </View>
        </View>
    </ThemedTile>
  );
};

const BluetoothDevice = () => {
  const {
    enableBluetooth,
    connectToDevice,
    stopScanPeripherals,
    scanForPeripherals,
    requestPermissions,
  } = useBLE();

  const isBluetoothOn = useBLEStore((s) => s.isBluetoothOn)
  const allDevices = useBLEStore((s) => s.allDevices)
  const connectedDevice = useBLEStore((s) => s.connectedDevice)

  const scanToggle = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (!isPermissionsEnabled) return;

    if (!isBluetoothOn) {
      await enableBluetooth()
      scanForPeripherals();
      return;
    }

    stopScanPeripherals();
  };

  const closeModal = () => {};

  const renderDeviceListItem = useCallback(
    (item: ListRenderItemInfo<Device>) => {
      return (
        <DeviceListItem
          item={item}
          connectToPeripheral={connectToDevice}
          closeModal={closeModal}
        />
      );
    },
    []
  );

  useEffect(() => { console.log("Connected Devices:", connectedDevice)}, [connectedDevice])

  return (
    <ThemedView style={styles.container}>
      <View
        style={{
          paddingVertical: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderColor: "#2c2c2c88",
          // backgroundColor: "brown",
        }}
      >
        <ThemedText>Bluetooth</ThemedText>
        <Switch
          value={isBluetoothOn}
          onValueChange={scanToggle}
          style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
          color="#1077d8ff"
        />
      </View>
      <FlatList
        contentContainerStyle={styles.deviceContainer}
        data={allDevices}
        renderItem={renderDeviceListItem}
        ListEmptyComponent={
          <ThemedText>No device detected, please turn on bluetooth</ThemedText>
        }
      />
    </ThemedView>
  );
};

export default BluetoothDevice;

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
  deviceName: {},
  deviceStatus: {},
});
