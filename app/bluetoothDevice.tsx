import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import ThemedTile from "@/components/themedTile";
import { useBLE } from "@/hooks/useBle";
import { useBLEStore } from "@/store/useBLEStore";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React, { FC, useCallback, useEffect } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet, View } from "react-native";
import { Device } from "react-native-ble-plx";
import { ActivityIndicator, Switch } from "react-native-paper";

type DeviceListItemProps = {
  item: ListRenderItemInfo<Device>;
  connectToPeripheral: (device: Device) => void;
  closeModal: () => void;
};

const DeviceListItem: FC<DeviceListItemProps> = ({
  item,
  connectToPeripheral,
  closeModal,
}) => {
  const connectedDevice = useBLEStore((s) => s.connectedDevice);

  const connectAndClose = useCallback(() => {
    console.log("try connect to device");
    connectToPeripheral(item.item);
  }, [closeModal, connectToPeripheral, item.item]);

  return (
    <ThemedTile
      onPress={connectAndClose}
      style={[
        styles.deviceItem,
        connectedDevice?.id === item.item.id && styles.active,
      ]}
    >
      <View style={{ width: "90%" }}>
        <ThemedText type="default" style={styles.deviceName}>
          {item.item.name || "unknown"}
        </ThemedText>
        <ThemedText type="small" style={{ opacity: 0.7 }}>
          {connectedDevice?.id === item.item.id ? "Connected" : "Not Connected"}
        </ThemedText>
      </View>
      <View style={{ width: "10%", justifyContent: "center" }}>
        <View
          style={[
            {
              backgroundColor: "#555555ff",
              padding: 13,
              paddingLeft: 16,
              borderRadius: 90,
            },
            connectedDevice?.id === item.item.id && styles.active,
          ]}
        >
          <FontAwesome6 name="angle-right" size={15} color="#c2c2c2ff" />
        </View>
      </View>
    </ThemedTile>
  );
};

const BluetoothDevice = () => {
  const { bluetooth, scan, connection, requestPermissions } = useBLE();

  const isBluetoothOn = useBLEStore((s) => s.isBluetoothOn);
  const isScanOn = useBLEStore((s) => s.isScanOn);
  const allDevices = useBLEStore((s) => s.allDevices);
  const connectedDevice = useBLEStore((s) => s.connectedDevice)

  const bluetoothToggle = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (!isPermissionsEnabled) return;

    if (!isBluetoothOn) {
      await bluetooth.enable();
      return;
    }

    await bluetooth.disable();
  };

  const scanToggle = () => {
    if (!isScanOn) {
      scan.start();
      return;
    }
    scan.stop();
  };

  const closeModal = () => {};

  const renderDeviceListItem = useCallback(
    (item: ListRenderItemInfo<Device>) => {
      return (
        <DeviceListItem
          item={item}
          connectToPeripheral={connection.connect}
          closeModal={closeModal}
        />
      );
    },
    [connection.connect]
  );

  useEffect(() => {
    bluetooth.getStatus();
    console.log(connectedDevice)
  }, []);

  return (
    <ThemedView style={styles.container}>
      {/* Bluetooth Switch */}
      <View
        style={{
          paddingVertical: 20,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <ThemedText>Bluetooth</ThemedText>
        <Switch
          value={isBluetoothOn}
          onValueChange={bluetoothToggle}
          style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
          color="#1077d8ff"
        />
      </View>

      {/* Scan Button */}
      <View
        style={{
          width: "100%",
          borderBottomColor: "#2c2c2c88",
          borderBottomWidth: 1.5,
          paddingBottom: 20,
        }}
      >
        <ThemedTile
          style={[styles.scanButton, isScanOn && styles.active]}
          onPress={scanToggle}
        >
          <ThemedText>
            {isScanOn ? "Stop Scanning" : "Start Scan Devices"}
          </ThemedText>
          {isScanOn && <ActivityIndicator animating={true} />}
        </ThemedTile>
      </View>

      {/* List Devices */}
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
    gap: 10,
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
  },
  scanButton: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
  active: {
    backgroundColor: "#1077d885",
  },
  deviceName: {},
});
