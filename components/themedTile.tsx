import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, Text, View, ViewProps } from 'react-native';

export type ThemedTileProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

const ThemedTile = ({ style, lightColor, darkColor, ...otherProps}: ThemedTileProps) => {
const color = useThemeColor({ light: lightColor, dark: darkColor }, 'backgroundTile');
  return (
    <View style={[style, { backgroundColor: color, borderRadius: 15  }]} {...otherProps} />
  )
}

export default ThemedTile
