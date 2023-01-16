import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as Location from "expo-location";

export default function CreatePostScreen({ navigation }) {
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState("");

  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <Button
        title="Give Permission"
        onPress={Camera.requestCameraPermissionsAsync}
      ></Button>
    );
  }

  const takePhoto = async () => {
    const photo = await camera.takePictureAsync();

    setPhoto(photo.uri);
  };

  const sendPhoto = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log("location", location);
    navigation.navigate("DefaultScreen", { photo });
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={setCamera} type={type}>
        {photo && (
          <View style={styles.photoContainer}>
            <Image style={styles.photo} source={{ uri: photo }} />
          </View>
        )}
        <TouchableOpacity style={styles.snapWrap} onPress={takePhoto}>
          <Text style={styles.snap}>SNAP</Text>
        </TouchableOpacity>
      </Camera>
      <View>
        <TouchableOpacity style={styles.snapWrap} onPress={sendPhoto}>
          <Text style={styles.snap}>send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
  },
  camera: {
    flex: 1,
    height: 240,
    marginHorizontal: 16,
    marginTop: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ff0000",
    justifyContent: "center",
    alignItems: "center",
  },
  snap: {
    color: "#fff",
  },
  snapWrap: {
    backgroundColor: "rgba(255, 255, 255, 0.3);",
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  photoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    borderWidth: 1,
    borderColor: "#112233",
  },
  photo: {
    width: 100,
    height: 100,
  },
});
