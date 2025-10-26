import { getBLEState, setBLEState } from "@/store/useBLEStore";
import { Device, Subscription } from "react-native-ble-plx";
import { BluetoothStateManager } from "react-native-bluetooth-state-manager";


type BLEActionTypes = {
  bluetooth: {
    enable: () => Promise<void>;
    disable: () => Promise<void>;
    getStatus: () => Promise<void>;
  };
  scan: {
    start: () => void;
    stop: () => void;
    clear: () => void;
  };
  connection: {
    connect: (device: Device) => Promise<void>;
    disconnect: () => void;
  };
  subscriptions: {
    add: (sub: Subscription) => void;
    clear: () => void;
    stopAll: () => void;
  };
};

export const BLEService: BLEActionTypes = {
  bluetooth: {
    enable: async () => {
      try {
        const prevBluetoothStatus = getBLEState().isBluetoothOn;
        if (!prevBluetoothStatus) {
          await BluetoothStateManager.requestToEnable();
        }
        setBLEState({ isBluetoothOn: true });
      } catch (error) {
        console.log(error);
      }
    },
    disable: async () => {
      // disconnect from device
      BLEService.connection.disconnect();

      // disable  bluetooth
      await BluetoothStateManager.requestToDisable();
      setBLEState({
        isBluetoothOn: false,
        connectedDevice: null,
        allDevices: [],
      });
    },

    getStatus: async () => {
      const state = await BluetoothStateManager.getState();
      if (state === "PoweredOn") return setBLEState({ isBluetoothOn: true });
      setBLEState({ isBluetoothOn: false });
    },
  },

  scan: {
    start: () => {
      const manager = getBLEState().bleManager;
      setBLEState({ isScanOn: true, allDevices: [] });

      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.log("ERROR FROM scanPeripheral:", error);
          setBLEState({ isScanOn: false });
          return;
        }

        if (device) {
          setBLEState((state) => {
            const exists = state.allDevices.some((d) => d.id === device.id);
            if (!exists) return { allDevices: [...state.allDevices, device] };
            return state;
          });
        }
      });

      console.log("START SCANNING DEVICES..");
    },

    stop: () => {
      const manager = getBLEState().bleManager;
      manager.stopDeviceScan();
      setBLEState({ isScanOn: false });
      console.log("Scanning stopped.");
    },

    clear: () => setBLEState({ allDevices: [] }),
  },

  connection: {
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
        BLEService.scan.stop()

        // start monitor connection
        manager.onDeviceDisconnected(device.id, (e, device) => {
          setBLEState({ connectedDevice: null });
          console.log("disconnected from: ", device?.id);
        });

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
  },

  subscriptions: {
    add: (sub: Subscription) =>
      setBLEState((state) => ({
        subscriptions: [...state.subscriptions, sub],
      })),

    clear: () =>
      setBLEState(() => ({
        subscriptions: [],
      })),

    stopAll: () => {
      const { subscriptions } = getBLEState();
      subscriptions.forEach((s) => s?.remove?.());
      setBLEState({ subscriptions: [] });
    },
  },
};