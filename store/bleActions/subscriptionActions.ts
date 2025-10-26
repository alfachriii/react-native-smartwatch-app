import { Subscription } from "react-native-ble-plx";
import { getBLEState, setBLEState } from "../useBLEStore";

export const subscriptionActions = {
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
};