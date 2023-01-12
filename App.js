import LoginScreen from "./src/Screens/LoginScreen";
import RegistrationScreen from "./src/Screens/RegistrationScreen";
import { View, Dimensions, Text } from "react-native";

import { useCallback, useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

export default function App() {
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

  const [fontsLoaded] = useFonts({
    "DMMono-Medium": require("./assets/fonts/DMMono-Medium.ttf"),
    "DMMono-MediumItalic": require("./assets/fonts/DMMono-MediumItalic.ttf"),
    "DMMono-Regular": require("./assets/fonts/DMMono-Regular.ttf"),
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
    <>
      <View
        style={{
          flex: 1,
        }}
        onLayout={onLayoutRootView}
      >
        <LoginScreen />
        {/* <RegistrationScreen /> */}
        {/* <Text>sf</Text> */}
      </View>
    </>
  );
}
