import React, { useState, useEffect } from "react";
import Svg, { Circle, Path } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";
import { authSignUpUser, updateAvatar } from "../../redux/auth/authOperations";
import { useDispatch } from "react-redux";
import { storage } from "../../firebase/config";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { authSlice } from "../../redux/auth/authReducer";
import uuid from "react-native-uuid";

import {
  StyleSheet,
  TextInput,
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  ActivityIndicator,
} from "react-native";

const initialState = {
  nickname: "",
  email: "",
  password: "",
  avatar: "",
};

export default function RegistrationScreen({ navigation }) {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setState] = useState(initialState);
  const [isSecureTextEntry, IsSecureTextEntry] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const hideKeyboard = Keyboard.addListener("keyboardDidHide", () => {
      setIsShowKeyboard(false);
    });

    return () => {
      hideKeyboard.remove();
    };
  }, []);

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };
  const keyboardHideAndSubmit = async () => {
    setLoading(true);
    keyboardHide();
    uploadAvararToServer();
    setState(initialState);
    await dispatch(authSignUpUser(state));
    setLoading(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
      setState((prevState) => ({ ...prevState, avatar: result.assets[0].uri }));
    }
  };

  const uploadAvararToServer = async () => {
    const image = await uploadPhotoToServer();
  };

  const uploadPhotoToServer = async () => {
    const response = await fetch(avatar);
    const file = await response.blob();
    const uid = uuid.v4();
    const storage = getStorage();
    const storageRef = await ref(storage, `avatars/${uid}`);
    const uploadTask = await uploadBytesResumable(storageRef, file);

    const processedPhoto = await getDownloadURL(storageRef);

    return processedPhoto;
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <ImageBackground
          style={styles.image}
          source={require("../../../assets/img/background.png")}
        >
          {loading && (
            <View style={styles.loaderWrap}>
              <ActivityIndicator
                size={100}
                color="#FF6C00"
                style={styles.loader}
              />
            </View>
          )}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "null"}
          >
            <View style={styles.avatarWrap}>
              <View style={styles.avatarBox}>
                <Image
                  style={{ height: "100%", width: "100%", borderRadius: 16 }}
                  source={{ uri: avatar }}
                ></Image>
                <TouchableOpacity style={styles.addBtnBox} onPress={pickImage}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="none"
                    viewBox="0 0 25 25"
                  >
                    <Circle
                      cx="12.5"
                      cy="12.5"
                      r="12"
                      fill="none"
                      stroke="#FF6C00"
                    ></Circle>
                    <Path
                      fill="#FF6C00"
                      fillRule="evenodd"
                      d="M13 6h-1v6H6v1h6v6h1v-6h6v-1h-6V6z"
                      clipRule="evenodd"
                    ></Path>
                  </Svg>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                ...styles.form,
                marginBottom: isShowKeyboard ? -200 : 0,
              }}
            >
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Регистрация</Text>
              </View>
              <View style={{ marginBottom: 16 }}>
                {/* <Text style={styles.inputTitle}>Email</Text> */}
                <TextInput
                  style={styles.input}
                  textAlign={"left"}
                  placeholder="Логин"
                  autoComplete="off"
                  placeholderTextColor="#BDBDBD"
                  onFocus={() => setIsShowKeyboard(true)}
                  value={state.nickname}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, nickname: value }))
                  }
                />
              </View>
              <View style={{ marginBottom: 16 }}>
                {/* <Text style={styles.inputTitle}>Email</Text> */}
                <TextInput
                  style={styles.input}
                  keyboardType="email-address"
                  textAlign={"left"}
                  placeholder="Адрес электронной почты"
                  placeholderTextColor="#BDBDBD"
                  onFocus={() => setIsShowKeyboard(true)}
                  value={state.email}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, email: value }))
                  }
                />
              </View>
              <View style={{ marginBottom: 43 }}>
                {/* <Text style={styles.inputTitle}>Password</Text> */}
                <TextInput
                  style={styles.input}
                  textAlign={"left"}
                  placeholder="Пароль"
                  placeholderTextColor="#BDBDBD"
                  secureTextEntry={isSecureTextEntry}
                  onFocus={() => setIsShowKeyboard(true)}
                  value={state.password}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, password: value }))
                  }
                />
              </View>
              <View style={styles.showPasswordBox}>
                <Text
                  style={styles.showPasswordText}
                  onPress={() => {
                    IsSecureTextEntry(!isSecureTextEntry);
                  }}
                >
                  {isSecureTextEntry ? "Показать" : "Скрыть"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.btn}
                activeOpacity={0.8}
                onPress={keyboardHideAndSubmit}
              >
                <Text style={styles.btnTitle}>Зарегистрироваться</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text style={styles.haveAccText}>Уже есть аккаунт?</Text>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => navigation.navigate("Login")}
                >
                  <Text style={styles.haveAccText}> Войти</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  loaderWrap: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: "#857d7d7d",
    height: "100%",
  },
  loader: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  input: {
    height: 50,
    color: "#212121",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    borderStyle: "solid",
    backgroundColor: "#F6F6F6",
    fontSize: 16,
    lineHeight: 19,
    paddingLeft: 16,
  },
  form: {
    backgroundColor: "#ffffff",
    paddingTop: 92,
    paddingHorizontal: 16,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: 549,
    //     position: "relative",
  },
  inputTitle: {
    color: "#fff",
    marginBottom: 10,
    fontSize: 18,
  },
  btn: {
    backgroundColor: "#FF6C00",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    marginBottom: 16,
  },
  btnTitle: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  header: {
    alignItems: "center",
    marginBottom: 33,
  },
  headerTitle: {
    fontFamily: "Roboto",
    fontSize: 30,
    lineHeight: 35,
    color: "#212121",
  },
  haveAccText: {
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    color: "#1B4371",
  },
  avatarBox: {
    height: 120,
    width: 120,
    backgroundColor: "#F6F6F6",
    // borderBottomColor: "red",
    // borderWidth: 1,
    borderRadius: 16,
  },
  avatarWrap: {
    position: "absolute",
    right: 0,
    left: 0,
    top: -60,
    alignItems: "center",
    zIndex: 1,
  },
  addBtnBox: {
    position: "absolute",
    right: -12,
    bottom: 14,
  },

  showPasswordBox: {
    bottom: 222,
    right: 32,
    position: "absolute",
  },
  showPasswordText: {
    fontSize: 16,
    lineHeight: 19,
    color: "#1B4371",
  },
});
