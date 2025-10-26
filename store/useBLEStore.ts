import { BleManager, Device, Subscription } from "react-native-ble-plx";
import { BluetoothStateManager } from "react-native-bluetooth-state-manager";
import { create } from "zustand";
import { bluetoothActions } from "./bleActions/bluetoothActions";
import { scanActions } from "./bleActions/scanActions";
import { connectionActions } from "./bleActions/connectionActions";
import { subscriptionActions } from "./bleActions/subscriptionActions";

const HTTP_REQUEST_SERVICE_UUID = "8aaca133-6aee-4a06-92a8-5315073fa0f3";
const HTTP_CHAR_NOTIFY = "1f05374b-18c8-4d5f-a670-f3d4a151ee5f";

// ====== State Type ======
type BLEStateTypes = {
  bleManager: BleManager;
  isBluetoothOn: boolean;
  isScanOn: boolean;
  allDevices: Device[];
  connectedDevice: Device | null;
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
  subscriptions: [],
}));

// ====== Actions ======
export const BLEActions = {
  scan: scanActions,
  bluetooth: bluetoothActions,
  connection: connectionActions,
  subscription: subscriptionActions,
};

// ====== Helper ======
export const setBLEState = (
  partial: Partial<BLEStateTypes> | ((state: BLEStateTypes) => Partial<BLEStateTypes>)
) => useBLEStore.setState(partial);
export const getBLEState = () => useBLEStore.getState();
