import { BleManager, Device, Service, Subscription } from "react-native-ble-plx";
import { create } from "zustand";


// ====== State Type ======
type BLEStateTypes = {
  bleManager: BleManager;
  isBluetoothOn: boolean;
  isScanOn: boolean;
  allDevices: Device[];
  connectedDevice: Device | null;
  services: Service[];
  subscriptions: Subscription[];
};

// ====== Actions Type ======
export type BLEActionTypes = {
  bluetooth: {
    enable: () => Promise<void>;
    disable: () => Promise<void>;
    getStatus: () => Promise<void>;
  };
  scanDevices: {
    start: () => void;
    stop: () => void;
    clear: () => void;
  };
  connection: {
    connect: (device: Device) => Promise<void>;
    disconnect: () => void;
  };
  subscriptions: {
    add: () => void;
    clear: () => void;
    stopAll: () => void;
  }
};

// ====== Store ======
export const useBLEStore = create<BLEStateTypes>((set, get) => ({
  bleManager: new BleManager(),
  isBluetoothOn: false,
  isScanOn: false,
  allDevices: [],
  connectedDevice: null,
  services: [],
  subscriptions: [],
}));

// ====== Helper ======
export const setBLEState = (
  partial: Partial<BLEStateTypes> | ((state: BLEStateTypes) => Partial<BLEStateTypes>)
) => useBLEStore.setState(partial);
export const getBLEState = () => useBLEStore.getState();
