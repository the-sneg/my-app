import { View, Dimensions } from "react-native";
import { useCallback, useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Main } from "./components/main";

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
        <Main />
      </Provider>
    </View>
  );
}
