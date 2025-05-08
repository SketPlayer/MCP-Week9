import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, Image, PermissionsAndroid } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';

export default function App() {
  const [uri, setUri] = useState("");

  const openImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
      },
      handleResponse
    );
  };

  const handleCameraLaunch = () => {
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
      },
      handleResponse
    );
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message: "This app needs access to your camera to take photos.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission granted");
        handleCameraLaunch();
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleResponse = (response) => {
    console.log("Camera Response:", response);

    if (response.didCancel) {
      console.log("User cancelled image picker");
    } else if (response.errorCode) {
      console.log("Image picker error: ", response.errorMessage);
    } else if (response.assets && response.assets.length > 0) {
      const imageUri = response.assets[0].uri;
      console.log("Image URI:", imageUri);
      setUri(imageUri);
      saveFile(imageUri);
    } else {
      console.log("No assets found in the response");
    }
  };

  const saveFile = async (imageUri) => {
    const path = RNFS.PicturesDirectoryPath + "/image_" + Date.now() + ".jpg";
    await RNFS.copyFile(imageUri, path)
      .then(() => {
        console.log("File copied to:", path);
      })
      .catch((error) => {
        console.error("Error copying file:", error);
      });
  }

  return (
    <View style={styles.container}>
      <Text>Rio Ferdinan - 00000070666</Text>
      <Button title="Open Camera" onPress={requestCameraPermission} />
      <Button title="Open Gallery" onPress={openImagePicker} />
      {uri ? (
        <Image source={{ uri }} style={{ width: 200, height: 200, marginTop: 20 }} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});