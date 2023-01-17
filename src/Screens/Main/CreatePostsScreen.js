import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
  TextInput,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as Location from "expo-location";

import { FontAwesome5 } from "@expo/vector-icons";

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
    navigation.navigate("Posts", { photo });
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraWrap}>
        <Camera style={styles.camera} ref={setCamera} type={type}>
          {photo && (
            <View style={styles.photoContainer}>
              <Image style={styles.photo} source={{ uri: photo }} />
            </View>
          )}
          <TouchableOpacity style={styles.snapWrap} onPress={takePhoto}>
            <FontAwesome5 name="camera" size={24} color="#BDBDBD" />
          </TouchableOpacity>
        </Camera>
      </View>
      <TouchableOpacity style={""} onPress={""}>
        <Text style={styles.uploadPhoto}>Загрузите фото</Text>
      </TouchableOpacity>
      <View>
        <TextInput
          style={{ ...styles.input, marginBottom: 16 }}
          placeholder="Название..."
        ></TextInput>
      </View>
      <View>
        <TextInput
          style={{ ...styles.input, marginBottom: 32 }}
          placeholder="Местность..."
        ></TextInput>
      </View>
      <TouchableOpacity style={styles.publishWrap} onPress={sendPhoto}>
        <Text style={styles.publish}>Опубликовать</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
  },
  camera: {
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "20%",
  },

  cameraWrap: {
    height: 240,
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 32,
    marginBottom: 8,
  },
  snap: {
    color: "#BDBDBD",
  },
  snapWrap: {
    // backgroundColor: "rgba(255, 255, 255, 0.3);",
    backgroundColor: "#FFFFFF",
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  publish: {
    color: "#BDBDBD",
    fontSize: 16,
  },
  publishWrap: {
    height: 51,
    backgroundColor: "#F6F6F6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
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

  input: {
    borderBottomWidth: 1,
    height: 50,
    fontSize: 16,
    borderColor: "#E8E8E8",
  },
  uploadPhoto: {
    fontSize: 16,
    color: "#BDBDBD",
    marginBottom: 32,
  },
});
