import { StatusBar } from "expo-status-bar";
import { StyleSheet, TextInput, View, ImageBackground } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.image}
        source={require("./assets/background.jpg")}
      >
        <TextInput style={styles.input} textAlign={"center"} />
      </ImageBackground>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    // alignItems: "center",
  },
  input: {
    // width: 100,
    marginHorizontal: 40,
    height: 40,
    color: "#00ff00",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
  },
});
