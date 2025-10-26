import React from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "../themed-text";
import ThemedTile from "../themedTile";

type CustomAlertProps = {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
};

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <ThemedTile style={styles.alertBox}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.message}>{message}</ThemedText>

          <View style={styles.buttonRow}>
            <Pressable style={styles.button} onPress={onClose}>
              <ThemedText type="defaultSemiBold">OK</ThemedText>
            </Pressable>
          </View>
        </ThemedTile>
      </Pressable>
    </Modal>
  );
};

export default CustomAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    width: 280,
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    opacity: 0.8,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#1077d8ff"
  },
});
