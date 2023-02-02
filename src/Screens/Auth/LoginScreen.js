import React, { useState, useEffect } from "react";

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
  ActivityIndicator,
} from "react-native";

import { authSignInUser } from "../../redux/auth/authOperations";
import { useDispatch } from "react-redux";

const initialState = {
  email: "",
  password: "",
};

export default function LoginScreen({ navigation }) {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setState] = useState(initialState);
  const [isSecureTextEntry, IsSecureTextEntry] = useState(true);
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
    setLoading(true);
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };
  const keyboardHideAndSubmit = () => {
    setLoading(true);
    keyboardHide();
    setState(initialState);
    dispatch(authSignInUser(state));
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <ImageBackground
          style={styles.image}
          source={require("../../../assets/img/background.png")}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View
              style={{
                ...styles.form,
                marginBottom: isShowKeyboard ? -200 : 0,
              }}
            >
              {loading && (
                <ActivityIndicator
                  style={styles.loader}
                  size={100}
                  color="red"
                />
              )}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Войти</Text>
              </View>
              <View style={{ marginBottom: 16 }}>
                {/* <Text style={styles.inputTitle}>Email</Text> */}
                <TextInput
                  style={styles.input}
                  textAlign={"left"}
                  keyboardType="email-address"
                  placeholder="Адрес электронной почты"
                  placeholderTextColor="#BDBDBD"
                  onFocus={() => setIsShowKeyboard(true)}
                  value={state.email}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, email: value }))
                  }
                />
              </View>
              <View style={{ marginBottom: 40 }}>
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
                <Text style={styles.btnTitle}>Войти</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text style={styles.noAccText}>Нет аккаунта?</Text>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => navigation.navigate("Registration")}
                >
                  <Text style={styles.noAccText}> Зарегистрироваться</Text>
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
    justifyContent: "flex-end",
  },

  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  input: {
    textAlign: "left",
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
    paddingTop: 32,
    paddingHorizontal: 16,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: 489,
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
  noAccText: {
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    color: "#1B4371",
  },
  showPasswordBox: {
    bottom: 288,

    right: 32,
    position: "absolute",
  },
  showPasswordText: {
    fontSize: 16,
    lineHeight: 19,
    color: "#1B4371",
  },
});
