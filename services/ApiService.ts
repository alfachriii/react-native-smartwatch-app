import Constants from "expo-constants";
import axios from "axios"
const apiUrl = process.env.EXPO_PUBLIC_OPENWEATHER_API_URL;


export const test = () => {
  console.log(apiUrl)
  
}
// const apiUrl = process.env.TZ.

// export class ApiService {
//   static async handleCommand(
//     command: Extract<ApiCommand, { type: "HTTP" }>
//   ): Promise<any> {
//     const { path } = command;

//     if (!path) {
//       throw new Error("Invalid command: missing path");
//     }

//     switch (path.toUpperCase()) {
//       case "WEATHER":
//         return this.getWeather();

//       default:
//         throw new Error(`Unknown API path: ${path}`);
//     }
//   }

//   private static async getWeather(params?: Record<string, any>) {
//     const city = params?.city ?? "Jakarta";
//     const apiKey = process.env.OPENWEATHER_API_KEY;
//     const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

//     const res = await fetch(url);
//     if (!res.ok) throw new Error(`Weather API error: ${res.statusText}`);

//     return res.json();
//   }
// }

export const getWeather = async () => {
  const response = await axios.get(`${apiUrl}`)
};
