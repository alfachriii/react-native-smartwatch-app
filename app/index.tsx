
import profilePicture from '@/assets/images/profileIcon.jpeg';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ThemedTile from '@/components/themedTile';
import WatchDisplay from '@/components/watchInfo/watchDisplay';
import WatchIndicator from '@/components/watchInfo/watchIndicator';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';

const getColor = (colorScheme: any) => colorScheme === "dark" ? "white" : "black"

export default function Home() {
  const colorScheme = useColorScheme();
  const color = getColor(colorScheme);

  const [isBluetoothConnected, setBluetoothConnected] = useState(true);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: "100%", alignItems: 'flex-end'}}>
          <Image source={profilePicture} style={styles.profilePic}></Image>
        </View>
        <Link href="/bluetoothDevice">
          <ThemedText type="title" >{(isBluetoothConnected) ? "alfachri's watch" : "Please Connect to device"}</ThemedText>
        </Link>
      </View>
      <ThemedView style={styles.infoBox}>
        <Link href="/bluetoothDevice">
          <WatchDisplay isConnected={isBluetoothConnected} />
        </Link>
        <WatchIndicator />
        <View style={styles.tilesContainer}>
          <ThemedTile style={styles.tile}>
            <Ionicons name="watch-outline" size={24} color={color} />
            <View >
              <ThemedText>Watch Faces</ThemedText>
            </View>
          </ThemedTile>
          <ThemedTile style={styles.tile}>
            <MaterialIcons name="widgets" size={24} color={color} />
            <View>
              <ThemedText>Watch Faces</ThemedText>
              <ThemedText type='small'>Tiles</ThemedText>
            </View>
          </ThemedTile>
        </View>
      </ThemedView>
      <ScrollView style={styles.settingsContainer}>
        <ThemedText style={{ marginBottom: 20 }}>Settings</ThemedText>
        <View style={styles.tilesContainer}>
          <ThemedTile style={styles.tile}>
            <Ionicons name="notifications-outline" size={24} color={color} />
            <View>
              <ThemedText>Notification</ThemedText>
              <ThemedText type='small'>Customize alerts, recently sent</ThemedText>
            </View>
          </ThemedTile>
          <ThemedTile style={styles.tile}>
            <MaterialIcons name="widgets" size={24} color={color} />
            <View>
              <ThemedText>Watch Faces</ThemedText>
              <ThemedText type='small'>Tiles</ThemedText>
            </View>
          </ThemedTile>
          <ThemedTile style={styles.tile}>
            <MaterialIcons name="widgets" size={24} color={color} />
            <View>
              <ThemedText>Watch Faces</ThemedText>
              <ThemedText type='small'>Tiles</ThemedText>
            </View>
          </ThemedTile>
          <ThemedTile style={styles.tile}>
            <MaterialIcons name="widgets" size={24} color={color} />
            <View>
              <ThemedText>Watch Faces</ThemedText>
              <ThemedText type='small'>Tiles</ThemedText>
            </View>
          </ThemedTile>
          <ThemedTile style={styles.tile}>
            <MaterialIcons name="widgets" size={24} color={color} />
            <View>
              <ThemedText>Watch Faces</ThemedText>
              <ThemedText type='small'>Tiles</ThemedText>
            </View>
          </ThemedTile>
          <ThemedTile style={styles.tile}>
            <MaterialIcons name="widgets" size={24} color={color} />
            <View>
              <ThemedText>Watch Faces</ThemedText>
              <ThemedText type='small'>Tiles</ThemedText>
            </View>
          </ThemedTile>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 65,
    paddingHorizontal: 25,
    paddingBottom: 50
  },
  header: {
    height: "10%",
    alignItems: "center",
  },
  infoBox: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
    paddingVertical: 20,
  },
  settingsContainer: {
    flexDirection: "column",
    paddingVertical: 20,
    paddingBottom: 50,
    overflowY: "hidden"
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 100,
    cursor: "pointer"
  },
  tilesContainer: {
    width: "100%",
    gap: 10,
  },
  tile: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 10,
    height: 80,
  },
});
