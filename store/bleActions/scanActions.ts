import { BLEActionTypes, getBLEState, setBLEState } from "../useBLEStore";

export const scanActions: BLEActionTypes["scanDevices"] = {
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
};
