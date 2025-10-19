import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFonts } from '@expo-google-fonts/montserrat';
import { Poppins_500Medium } from '@expo-google-fonts/poppins';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
      Poppins_500Medium,
    })
  
  return (
    <PaperProvider>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{
        headerTitleStyle: { fontFamily: "Poppins_500Medium" }
      }}>
        <Stack.Screen name='index' options={{
          headerShown: false,
         }}/>
         <Stack.Screen name='bluetoothDevice' options={{ 
          title: "Bluetooth"
          }}/>
         <StatusBar style='auto'/>
      </Stack>
    </ThemeProvider>
    </PaperProvider>
  );
}
