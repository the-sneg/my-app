import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, Image, Button } from "react-native";

export default function DefaultPostScreen({ route, navigation }) {
  const [posts, setPosts] = useState([]);
  console.log("params ", route.params);

  useEffect(() => {
    if (route.params) {
      setPosts((prevState) => [...prevState, route.params]);
    }
  }, [route.params]);

  console.log("posts", posts);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item, indx) => indx.toString()}
        renderItem={({ item }) => (
          <View>
            <Image source={{ uri: item.photo }} style={styles.postImg} />
          </View>
        )}
      />
      <Button
        title="comments"
        onPress={() => navigation.navigate("Comments")}
      />
      <Button title="map" onPress={() => navigation.navigate("Map")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  img: {
    width: 200,
    height: 200,
    borderColor: "#ff0000",
    borderWidth: 1,
    overflow: "visible",
    marginTop: 20,
  },
  postImg: {
    height: 240,
    borderRadius: 16,
  },
});
