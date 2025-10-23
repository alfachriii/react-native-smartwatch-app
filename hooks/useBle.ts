import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleError, BleManager, Characteristic, Device } from "react-native-ble-plx";
import {
    BluetoothStateManager
} from "react-native-bluetooth-state-manager";


import * as ExpoDevice from "expo-device";

const HTTP_REQUEST_SERVICE_UUID = "8aaca133-6aee-4a06-92a8-5315073fa0f3";
const HTTP_CHAR_NOTFIY = "1f05374b-18c8-4d5f-a670-f3d4a151ee5f";
const HTTP_CHAR_WRITE = "dcad77b2-5e91-4d65-a2db-596d6685ccb2";

interface BLEApi {
    requestPermissions(): Promise<boolean>;
    scanForPeripherals(): void;
    stopScanPeripherals(): void;
    connectToDevice: (deviceId: Device) => Promise<void>;
    disconnectFromDevice: () => void;
    isBluetoothOn: boolean;
    connectedDevice: Device | null;
    allDevices: Device[];
    httpRequest: string | null;
}

const useBLE = ():BLEApi => {
    const bleManager = useMemo(() => new BleManager, []);
    const [isBluetoothOn, setBluetoothOn] = useState<boolean>(false);
    const [allDevices, setAllDevices] = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
    const [httpRequest, setHttpRequest] = useState<string | null>(null);

    const requestAndroid31Permissions = async () => {
        const bluetoothScanPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            {
                title: "Location Permission",
                message: "Bluetooth Low Energy requires Location",
                buttonPositive: "OK",
            }
        )

        const bluetoothConnectPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            {
                title: "Location Permission",
                message: "Bluetooth Low Energy requires Location",
                buttonPositive: "OK",
            }
        );

        const fineLocationPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "Location Permission",
                message: "Bluetooth Low Energy requires Location",
                buttonPositive: "OK",
            }
        );

        return (
            bluetoothScanPermission === "granted" &&
            bluetoothConnectPermission === "granted" &&
            fineLocationPermission === "granted"
        );
    };
    
    const requestPermissions = async () => {
        if(Platform.OS === "android") {
            if((ExpoDevice.platformApiLevel ?? -1) < 31) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Location Permission",
                        message: "Bluetooth Low Energy requires Location",
                        buttonPositive: "OK",
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } else {
                const isAndroid31PermissionsGranted =
                await requestAndroid31Permissions();

                return isAndroid31PermissionsGranted;
            }
        } else {
        return true;
        }
    };

    const isDuplicteDevice = (devices: Device[], nextDevice: Device) => {
        return devices.findIndex((device) => nextDevice.id === device.id) > -1
    };

    const scanForPeripherals = async () => {
        const state = await BluetoothStateManager.getState();

        console.log(state);

        if(state !== "PoweredOn") {
            await BluetoothStateManager.requestToEnable();
        }

            console.log("START SCANNING DEVICES..");
            setBluetoothOn(true);

            bleManager.startDeviceScan(null, null, (error, device) => {
                if (error) {
                    console.log("ERROR FROM scanPeripheral: ", error);
                }
        
                if (device) {
                    setAllDevices((prevState: Device[]) => {
                    if (!isDuplicteDevice(prevState, device)) {
                        return [...prevState, device];
                    }
                    return prevState;
                    });
                }
            });
    };

    const stopScanPeripherals = async () => {
        await BluetoothStateManager.requestToDisable();
        setBluetoothOn(false);
        console.log("STOP SCANNING, BLE OFF..")
    }

    const connectToDevice = async (device: Device) => {
        try {
            const deviceConnection = await bleManager.connectToDevice(device.id);
            setConnectedDevice(deviceConnection);
            await deviceConnection.discoverAllServicesAndCharacteristics();
            bleManager.stopDeviceScan();
        } catch (error) {
            console.log("Failed to connect", error);
        }
    }

    const disconnectFromDevice = () => {
        if(connectedDevice) {
            bleManager.cancelDeviceConnection(connectedDevice.id);
            setConnectedDevice(null);
            setHttpRequest(null);
        }
    }

    const onGetHttpRequest = (error: BleError | null, characteristic: Characteristic | null) => {
        if(error) {
            console.log(error);
            return;
        } 
        if(!characteristic?.value) {
            console.log("No http request");
            return;
        }

    }

    const startStreamingData = async (device: Device) => {
        if(device) {
            device.monitorCharacteristicForService(
                HTTP_REQUEST_SERVICE_UUID, 
                HTTP_CHAR_NOTFIY,
                onGetHttpRequest
            )
        } else {
            console.log("can't monitor char, No device connected!")
        }
    }

    return {
        scanForPeripherals,
        stopScanPeripherals,
        requestPermissions,
        connectToDevice,
        isBluetoothOn,
        allDevices,
        connectedDevice,
        disconnectFromDevice,
        httpRequest
    }
}

export default useBLE