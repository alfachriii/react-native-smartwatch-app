import { getBLEState, setBLEState } from "@/store/useBLEStore";
import base64 from "react-native-base64";
import {
  BleError,
  Characteristic,
  Device,
  Service,
  Subscription,
} from "react-native-ble-plx";
import { BluetoothStateManager } from "react-native-bluetooth-state-manager";

const HTTP_REQUEST_SERVICE_UUID = "8aaca133-6aee-4a06-92a8-5315073fa0f3";
const HTTP_CHAR_NOTIFY = "1f05374b-18c8-4d5f-a670-f3d4a151ee5f";

const onGetHttpRequest = (
  error: BleError | null,
  characteristic: Characteristic | null
) => {
  if (error) {
    console.warn("Error monitoring", characteristic, error);
    return;
  }

  // const base64Value = characteristic?.value ?? "";
  // const bytes = Buffer.from(base64Value, "base64");

  // // misal 16-bit unsigned integer
  // const int16 = bytes.readUInt16LE(0);
  // console.log("Int16 value:", int16);
  
  const b64 = characteristic?.value ?? "";
  const decodedBytes = base64.decode(b64);

  console.log(decodedBytes)
};

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
  device: {
    getServices: () => Promise<void>;
    getCharacteristicsForService: (service: Service) => Promise<void>;
  };
  subscriptions: {
    add: (sub: Subscription) => void;
    clear: () => void;
    stopAll: () => void;
  };
  monitorHttpRequest: {
    start: (device: Device) => void;
    stop: () => void;
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

        console.log("✅ Connected:", connectedDevice);
        setBLEState({ connectedDevice: connectedDevice });

        // stop scanning
        BLEService.scan.stop();

        // start monitor connection
        manager.onDeviceDisconnected(device.id, (e, device) => {
          setBLEState({ connectedDevice: null });
          console.log("disconnected from: ", device?.id);
        });

        // monitor http notify
        BLEService.monitorHttpRequest.start(device);

        setBLEState({ isScanOn: false });
        console.log("Scanning stopped.");
      } catch (error: any) {
        console.log("❌ Connection error:", error?.message || error);
      }
    },

    disconnect: () => {
      const manager = getBLEState().bleManager;
      const connectedDevice = getBLEState().connectedDevice;
      BLEService.subscriptions.clear()
      if (connectedDevice) {
        manager.cancelDeviceConnection(connectedDevice.id);
        setBLEState({ connectedDevice: null });
      }
    },
  },

  device: {
    getServices: async () => {
      const manager = getBLEState().bleManager;
      const device = getBLEState().connectedDevice;

      if (!device)
        return console.log("Can't getServices, No devices connected");

      try {
        const services = await manager.servicesForDevice(device.id);
        setBLEState({ services: services });
      } catch (error) {
        console.log("ERROR getServices: ", error);
      }
    },
    getCharacteristicsForService: async () => {},
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

  monitorHttpRequest: {
    start: (device) => {
      const sub = device.monitorCharacteristicForService(
        HTTP_REQUEST_SERVICE_UUID,
        HTTP_CHAR_NOTIFY,
        onGetHttpRequest
      );

      setBLEState((state) => ({
        subscriptions: [...state.subscriptions, sub],
      }));
    },
    stop: () => {},
  },
};
