import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import {
  getDocs,
  getDoc,
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useSelector } from "react-redux";

export default function DefaultPostScreen({ route, navigation }) {
  const [posts, setPosts] = useState([]);
  const { email, login, avatar, userId } = useSelector((state) => state.auth);

  const getAllPosts = async () => {
    const querySnapshot = await getDocs(collection(db, "posts"));
    let newPosts = [];
    querySnapshot.forEach((doc) => {
      newPosts.push({ ...doc.data(), id: doc.id });
    });
    setPosts(newPosts);
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    getAllPosts();
  }, [posts, isFocused]);

  const addLike = async (id) => {
    const result = await getDoc(doc(db, "posts", `${id}`));
    console.log("result", result.data());
    if (result.data().likes.includes(`${userId}`)) {
      await updateDoc(doc(db, "posts", `${id}`), {
        likes: arrayRemove(`${userId}`),
      });
    } else {
      await updateDoc(doc(db, "posts", `${id}`), {
        likes: arrayUnion(`${userId}`),
      });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
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
                  onPress={async () => {
                    navigation.navigate("Comments", {
                      image: item.image,
                      postId: item.id,
                    });
                  }}
                >
                  <Text style={styles.commentsTitle}>{item.comments}</Text>
                  {item.comments > 0 ? (
                    <Ionicons
                      name="md-chatbubble-sharp"
                      size={24}
                      color="#FF6C00"
                    />
                  ) : (
                    <Feather name="message-circle" size={24} color="#BDBDBD" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.likesInfo}
                  onPress={() => addLike(item.id)}
                >
                  {item?.likes?.includes(`${userId}`) ? (
                    <AntDesign name="like1" size={24} color="#FF6C00" />
                  ) : item.likes.length > 0 ? (
                    <AntDesign name="like2" size={24} color="#FF6C00" />
                  ) : (
                    <AntDesign name="like2" size={24} color="#BDBDBD" />
                  )}

                  <Text style={styles.likesNumber}>
                    {item.likes.length || 0}
                  </Text>
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
    paddingTop: 32,
  },

  postImg: {
    height: 240,
    borderRadius: 16,
    marginBottom: 8,
  },
  postWrap: {
    marginBottom: 32,
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
    transform: [{ rotateY: "180deg" }],
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
    maxWidth: 150,
  },
  infoWrap: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likesInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: "auto",
    marginLeft: 24,
  },
  likesNumber: {
    fontSize: 16,
    lineHeight: 19,
    color: "#BDBDBD",
    marginLeft: 6,
  },
});
