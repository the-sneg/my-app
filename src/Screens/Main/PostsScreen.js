import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

import { Feather } from "@expo/vector-icons";

export default function DefaultPostScreen({ route, navigation }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (route.params) {
      setPosts((prevState) => [...prevState, route.params]);
    }
  }, [route.params]);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item, indx) => indx.toString()}
        renderItem={({ item }) => (
          console.log("itemmmm", { uri: item.photo }),
          (
            <View style={styles.postWrap}>
              <Image source={{ uri: item.photo }} style={styles.postImg} />
              <Text style={styles.postTitle}>{route.params.imageTitle}</Text>
              <View style={styles.infoWrap}>
                <TouchableOpacity
                  style={styles.comments}
                  onPress={() => navigation.navigate("Comments")}
                >
                  <Text style={styles.commentsTitle}>0</Text>
                  <Feather name="message-circle" size={24} color="#BDBDBD" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.lokation}
                  onPress={() =>
                    navigation.navigate("Map", {
                      location: route.params.location.coords,
                      title: route.params.locationTitle,
                    })
                  }
                >
                  <Feather name="map-pin" size={24} color="#BDBDBD" />
                  <Text style={styles.lokationTitle}>
                    {route.params.locationTitle}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
  },

  postImg: {
    height: 240,
    borderRadius: 16,
    marginBottom: 8,
  },
  postWrap: {
    marginTop: 32,
  },
  postTitle: {
    marginBottom: 12,
    fontSize: 16,
    color: "#212121",
  },
  comments: {
    transform: [{ rotateY: "180deg" }],
    flexDirection: "row",
    alignItems: "center",
  },
  commentsTitle: {
    color: "#BDBDBD",
    fontSize: 16,
    marginRight: 6,
  },
  lokation: {
    flexDirection: "row",
    alignItems: "center",
  },

  lokationTitle: {
    color: "#212121",
    textDecorationLine: "underline",
    fontSize: 16,
    marginLeft: 4,
  },
  infoWrap: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
