import { BluetoothStateManager } from "react-native-bluetooth-state-manager";
import {
  BLEActionTypes,
  getBLEState,
  setBLEState,
  useBLEStore,
} from "../useBLEStore";


export const bluetoothActions: BLEActionTypes["bluetooth"] = {
  enable: async () => {
    try {
      const prevBluetoothStatus = getBLEState().isBluetoothOn
      if (!prevBluetoothStatus) {
        await BluetoothStateManager.requestToEnable();
      }
      setBLEState({ isBluetoothOn: true });
    } catch (error) {
      console.log(error);
    }
  },
  disable: async () => {
    const manager = getBLEState().bleManager;
    // disconnect from device
    const connectedDevice = getBLEState().connectedDevice;
    if (connectedDevice) {
      manager.cancelDeviceConnection(connectedDevice.id);
      setBLEState({ connectedDevice: null });
    }

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
};
