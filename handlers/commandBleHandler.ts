import { parseCommand } from "@/core/commandParser";
import { getWeather } from "@/services/ApiService";
import base64 from "react-native-base64";
import { BleError, Characteristic } from "react-native-ble-plx";

export const handleBLECommand = async (
  error: BleError | null,
  characteristic: Characteristic | null
) => {
  if (error) {
    console.warn("Error monitoring", characteristic, error);
  }

  const rawValue = characteristic?.value ?? "";
  const decodedValue = base64.decode(rawValue);

  const command = parseCommand(decodedValue);

  switch (command.type) {
    case "HTTP":
      switch (command.method) {
        case "GET": {
          const result = await getWeather();
          break;
        }
        case "POST": {
          // const result = await postData();
          break;
        }
      }
      break;

    case "MUSIC":
      switch (command.action) {
        case "PLAY":
          console.log("🎵 Play music");
          break;
        case "PAUSE":
          console.log("⏸ Pause music");
          break;
        default:
          console.log("⚠️ Unknown music action:", command.action);
      }
      break;

    default:
      console.log("❓ Unknown command:", decodedValue);
  }
};
