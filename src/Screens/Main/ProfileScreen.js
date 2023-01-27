import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSelector } from "react-redux";

import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Feather } from "@expo/vector-icons";

export default function ProfileScreen({ navigation }) {
  const { userId } = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);
  console.log("userPostss", userPosts);

  useEffect(() => {
    getUserPosts();
  }, []);

  const getUserPosts = async () => {
    const q = query(collection(db, "posts"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    let newPosts = [];
    querySnapshot.forEach((doc) => {
      newPosts.push({ ...doc.data(), id: doc.id });
    });
    setUserPosts(newPosts);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={userPosts}
        keyExtractor={(item, indx) => indx.toString()}
        renderItem={({ item }) => (
          { uri: item.image },
          (
            <View style={styles.postWrap}>
              <Image source={{ uri: item.image }} style={styles.postImg} />
              <Text style={styles.postTitle}>{item.imageTitle}</Text>
              <View style={styles.infoWrap}>
                <TouchableOpacity
                  style={styles.comments}
                  onPress={() =>
                    navigation.navigate("Comments", { postId: item.id })
                  }
                >
                  <Text style={styles.commentsTitle}> 0</Text>
                  <Feather name="message-circle" size={24} color="#BDBDBD" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.location}
                  onPress={() =>
                    navigation.navigate("Map", {
                      location: item.location,
                      title: item.locationTitle,
                    })
                  }
                >
                  <Feather name="map-pin" size={24} color="#BDBDBD" />
                  <Text style={styles.locationTitle}>{item.locationTitle}</Text>
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
  location: {
    flexDirection: "row",
    alignItems: "center",
  },

  locationTitle: {
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
