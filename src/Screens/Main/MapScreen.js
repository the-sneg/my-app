import React from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function MapScreen({ route, navigation }) {
  const { latitude, longitude } = route.params.location.coords;
  console.log("route.params.locationTitle", route.params);
  return (
    <View style={styles.container}>
      <Text>
        {" "}
        Need some money to view map... TITLE:
        {(latitude, longitude, route.params.locationTitle)}{" "}
      </Text>
      {/* <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.006,
        }}
      >
        <Marker
          coordinate={{
            latitude,
            longitude,
          }}
          title={route.params.locationTitle}
        />
      </MapView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
