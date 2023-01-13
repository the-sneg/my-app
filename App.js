import { View, Dimensions, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useCallback, useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useRoute } from "./router";

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

  const routing = useRoute();

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
    <View
      style={{
        flex: 1,
      }}
      onLayout={onLayoutRootView}
    >
      <NavigationContainer>{routing}</NavigationContainer>
    </View>
  );
}
