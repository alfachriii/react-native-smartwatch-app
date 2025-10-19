import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, useFonts, } from '@expo-google-fonts/poppins';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'time' | 'small';
  selectedFont?: string;
};

export function ThemedText({
  style,
  selectedFont,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold
  })

  return (
    <Text
      style={[
        { color }, 
        type === 'small' ? styles.small : undefined,
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'time' ? styles.time : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular"
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Poppins_400Regular"
  },
  defaultSemiBold: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: "Poppins_500Medium"
  },
  title: {
    fontSize: 32,
    fontFamily: "Poppins_500Medium",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
  time: {
    lineHeight: 60,
    fontSize: 55,
    fontFamily: "Poppins_700Bold"
  }
});
