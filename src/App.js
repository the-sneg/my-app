import { View, Dimensions, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useRoute } from "./router";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { auth } from "./firebase/config";

export default function App() {
  auth.onAuthStateChanged((user) => setUser(user));

  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get("window").width;
      console.log("width:", width);
    };
    const widthChange = Dimensions.addEventListener("change", onChange);

    return () => {
      widthChange.remove();
    };
  }, []);

  const [user, setUser] = useState(null);

  const routing = useRoute(user);

  console.log("first", user);

  const [fontsLoaded] = useFonts({
    "DMMono-Medium": require("../assets/fonts/DMMono-Medium.ttf"),
    "DMMono-MediumItalic": require("../assets/fonts/DMMono-MediumItalic.ttf"),
    "DMMono-Regular": require("../assets/fonts/DMMono-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
      }}
      onLayout={onLayoutRootView}
    >
      <Provider store={store}>
        <NavigationContainer>{routing}</NavigationContainer>
      </Provider>
    </View>
  );
}
