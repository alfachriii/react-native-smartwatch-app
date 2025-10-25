import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableOpacityProps,
  ViewStyle,
  StyleProp,
} from "react-native";

export interface ThemedTileProps extends TouchableOpacityProps {
  lightColor?: string;
  darkColor?: string;
  style?: StyleProp<ViewStyle>;
}

const ThemedTile: React.FC<ThemedTileProps> = ({
  style,
  lightColor,
  darkColor,
  children,
  ...otherProps
}) => {
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "backgroundTile"
  );

  return (
    <TouchableOpacity
      style={[{ backgroundColor: color, borderRadius: 15 }, style]}
      {...otherProps}>
      {children}
      </TouchableOpacity>
  );
};

export default ThemedTile;
