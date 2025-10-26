import { Device } from "react-native-ble-plx";
import { BLEActionTypes, getBLEState, setBLEState } from "../useBLEStore";


export const connectionActions: BLEActionTypes["connection"] = {
  connect: async (device: Device) => {
    const manager = getBLEState().bleManager;
    try {
      console.log("🔄 Connecting to:", device.name);

      const connectedDevice = await manager.connectToDevice(device.id, {
        timeout: 10000,
      });
      await connectedDevice.discoverAllServicesAndCharacteristics();

      console.log("✅ Connected:", connectedDevice.name);
      setBLEState({ connectedDevice: connectedDevice });

      // stop scanning
      manager.stopDeviceScan();
      setBLEState({ isScanOn: false });
      console.log("Scanning stopped.");
    } catch (error: any) {
      console.log("❌ Connection error:", error?.message || error);
    }
  },

  disconnect: () => {
    const manager = getBLEState().bleManager;
    const connectedDevice = getBLEState().connectedDevice;
    if (connectedDevice) {
      manager.cancelDeviceConnection(connectedDevice.id);
      setBLEState({ connectedDevice: null });
    }
  },
};
