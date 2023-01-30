import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as Location from "expo-location";

import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { db } from "../../firebase/config";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import uuid from "react-native-uuid";
import { useIsFocused } from "@react-navigation/native";

export default function CreatePostScreen({ navigation }) {
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState("");

  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);

  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  const [imageTitle, setImageTitle] = useState("");
  const [locationTitle, setLocationTitle] = useState("");
  const [location, setLocation] = useState(null);

  const { userId, nickname, avatar } = useSelector((state) => state.auth);
  console.log("nickname", nickname);

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  useEffect(() => {
    const hideKeyboard = Keyboard.addListener("keyboardDidHide", () => {
      setIsShowKeyboard(false);
    });

    return () => {
      hideKeyboard.remove();
    };
  }, []);

  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
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
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    setPhoto(photo.uri);
  };

  const uploadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setPhoto(result.assets[0].uri);
    }
  };

  const sendPhoto = async () => {
    uploadPostToServer();
    navigation.navigate("Posts");
  };

  const uploadPostToServer = async () => {
    const date = new Date().toLocaleString();
    const datess = 6;
    const dates = new Date().toLocaleString();
    const image = await uploadPhotoToServer();

    const createPost = await addDoc(collection(db, "posts"), {
      userId,
      nickname,
      avatar,
      image,
      date,
      imageTitle,
      location,
      locationTitle,
      comments: 0,
      likes: [],
    });
  };

  const uploadPhotoToServer = async () => {
    const response = await fetch(photo);
    const file = await response.blob();
    const uid = uuid.v4();
    const storage = getStorage();
    const storageRef = await ref(storage, `images/${uid}`);
    const uploadTask = await uploadBytesResumable(storageRef, file);

    const processedPhoto = await getDownloadURL(storageRef);

    return processedPhoto;
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "null"}
        >
          <View style={styles.Wrap}>
            <View
              style={{
                ...styles.cameraWrap,
                display: isShowKeyboard ? "none" : "flex",
              }}
            >
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
            <TouchableOpacity
              style={{ width: 116 }}
              onPress={() => uploadImage()}
            >
              <Text style={styles.uploadPhoto}>Загрузите фото</Text>
            </TouchableOpacity>
            <View>
              <TextInput
                onFocus={() => setIsShowKeyboard(true)}
                style={{ ...styles.input, marginBottom: 16 }}
                placeholder="Название..."
                onChangeText={setImageTitle}
                value={imageTitle}
              ></TextInput>
            </View>
            <View>
              <TextInput
                onFocus={() => setIsShowKeyboard(true)}
                style={{ ...styles.input, marginBottom: 32 }}
                placeholder="Местность..."
                maxLength={10}
                onChangeText={setLocationTitle}
                value={locationTitle}
              ></TextInput>
            </View>
            <TouchableOpacity
              style={{ ...styles.publishWrap, marginBottom: 16 }}
              onPress={sendPhoto}
            >
              <Text style={styles.publish}>Опубликовать</Text>
            </TouchableOpacity>
            <View style={styles.deleteWrap}>
              <TouchableOpacity style={styles.delete} onPress={""}>
                <Feather name="trash-2" size={24} color="#DADADA" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
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
  deleteWrap: {
    justifyContent: "center",
    alignItems: "center",
  },

  delete: {
    backgroundColor: "#F6F6F6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    width: 70,
    height: 40,
  },
  // Wrap: {
  //   marginBottom: 100,
  // },
});
