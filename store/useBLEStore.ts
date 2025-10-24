import { Device } from "react-native-ble-plx";
import { create } from "zustand"


type BLEState = {
  isBluetoothOn: boolean;
  allDevices: Device[];
  connectedDevice: Device | null;
};

type BLEAction = {
  setBluetoothOn: (value: boolean) => void;
  setAllDevices: (devices: Device) => void;
  clearAllDevices: () => void;
  setConnectedDevice: (device: Device | null) => void;
};

export const useBLEStore = create<BLEState & BLEAction>((set) => ({
  isBluetoothOn: false,
  allDevices: [],
  connectedDevice: null,

  setBluetoothOn: (value) => set({ isBluetoothOn: value }),
  setAllDevices: (device) =>
    set((state) => {
      const exists = state.allDevices.find((d) => d.id === device.id);
      if (!exists) return { allDevices: [...state.allDevices, device] };
      return state;
    }),
  clearAllDevices: () => set({ allDevices: [] }),
  setConnectedDevice: (device) => set({ connectedDevice: device }),

}));

// export const useIsBluetoothOn = useBLEStore((state) => state.isBluetoothOn);
