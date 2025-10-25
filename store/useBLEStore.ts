import {
  BleManager,
  Device,
  BleError,
  Characteristic,
} from "react-native-ble-plx";
import { BluetoothStateManager } from "react-native-bluetooth-state-manager";
import { create } from "zustand";

const HTTP_REQUEST_SERVICE_UUID = "8aaca133-6aee-4a06-92a8-5315073fa0f3";
const HTTP_CHAR_NOTIFY = "1f05374b-18c8-4d5f-a670-f3d4a151ee5f";

type BLEState = {
  bleManager: BleManager;
  isBluetoothOn: boolean;
  isScanOn: boolean;
  allDevices: Device[];
  connectedDevice: Device | null;
};

type BLEAction = {
  setBluetoothOn: (value: boolean) => void;
  setScanOn: (value: boolean) => void;
  setAllDevices: (device: Device) => void;
  clearAllDevices: () => void;
  setConnectedDevice: (device: Device | null) => void;
  enableBluetooth: () => Promise<void>;
  disableBluetooth: () => Promise<void>;
  scanForPeripherals: () => void;
  stopScanPeripherals: () => void;
  connectToDevice: (device: Device) => Promise<void>;
  disconnectFromDevice: () => void;
};

export const useBLEStore = create<BLEState & BLEAction>((set, get) => ({
  bleManager: new BleManager(),
  isBluetoothOn: false,
  isScanOn: false,
  allDevices: [],
  connectedDevice: null,

  setBluetoothOn: (value) => set({ isBluetoothOn: value }),
  setScanOn: (value) => set({ isScanOn: value }),
  setAllDevices: (device) =>
    set((state) => {
      if (!device?.id) return state;
      const exists = state.allDevices.some((d) => d.id === device.id);
      if (exists) return state;
      return { allDevices: [...state.allDevices, device] };
    }),
  clearAllDevices: () => set({ allDevices: [] }),
  setConnectedDevice: (device) => set({ connectedDevice: device }),

  enableBluetooth: async () => {
    const state = await BluetoothStateManager.getState();
    if (state !== "PoweredOn") {
      await BluetoothStateManager.requestToEnable();
    }
    set({ isBluetoothOn: true });
  },

  disableBluetooth: async () => {
    await BluetoothStateManager.requestToDisable();
    get().stopScanPeripherals();
    set({ isBluetoothOn: false, connectedDevice: null, allDevices: [] });
  },

  scanForPeripherals: () => {
    const manager = get().bleManager;
    set({ isScanOn: true, allDevices: [] });

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("ERROR FROM scanPeripheral:", error);
        set({ isScanOn: false });
        return;
      }

      if (device) {
        set((state) => {
          const exists = state.allDevices.some((d) => d.id === device.id);
          if (!exists) return { allDevices: [...state.allDevices, device] };
          return state;
        });
      }
    });

    console.log("START SCANNING DEVICES..");
  },

  stopScanPeripherals: () => {
    const manager = get().bleManager;
    manager.stopDeviceScan();
    set({ isScanOn: false });
    console.log("STOP SCANNING..");
  },

  connectToDevice: async (device: Device) => {
    const manager = get().bleManager;
    try {
      console.log("🔄 Connecting to:", device.name);

      manager.stopDeviceScan();

      const connectedDevice = await manager.connectToDevice(device.id, {
        timeout: 10000,
      });
      await connectedDevice.discoverAllServicesAndCharacteristics();

      console.log("✅ Connected:", connectedDevice.name);
      set({ connectedDevice: connectedDevice });
    } catch (error: any) {
      console.log("❌ Connection error:", error?.message || error);
    }
    // try {
    //   console.log("Connecting to device:", device.name || device.id);
    //   const connected = await manager.connectToDevice(device.id);
    //   await connected.discoverAllServicesAndCharacteristics();
    //   set({ connectedDevice: connected });
    //   manager.stopDeviceScan();
    //   console.log("✅ Connected:", connected.id);

    //   connected.monitorCharacteristicForService(
    //     HTTP_REQUEST_SERVICE_UUID,
    //     HTTP_CHAR_NOTIFY,
    //     (error: BleError | null, characteristic: Characteristic | null) => {
    //       if (error) {
    //         console.log("Monitor error:", error);
    //         return;
    //       }
    //       if (characteristic?.value) {
    //         console.log("Received data:", characteristic.value);
    //       }
    //     }
    //   );
    // } catch (error) {
    //   console.log("❌ Failed to connect:", error);
    // }
  },

  disconnectFromDevice: () => {
    const manager = get().bleManager;
    const connectedDevice = get().connectedDevice;
    if (connectedDevice) {
      manager.cancelDeviceConnection(connectedDevice.id);
      set({ connectedDevice: null });
    }
  },
}));
