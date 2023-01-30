import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";
import { pathSlice } from "../../redux/path/pathReducer";

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

export default function DefaultPostScreen({ route, navigation }) {
  const dispatch = useDispatch();

  const [posts, setPosts] = useState([]);
  const { userId } = useSelector((state) => state.auth);

  const flatListRef = useRef();
  const toTop = () => {
    flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
  };

  const getAllPosts = async () => {
    const querySnapshot = await getDocs(collection(db, "posts"));
    let allPosts = [];
    querySnapshot.forEach((doc) => {
      allPosts.push({ ...doc.data(), id: doc.id });
    });

    const sortedPosts = allPosts.sort(function (a, b) {
      if (a.date > b.date) {
        return -1;
      }
      if (a.date < b.date) {
        return 1;
      }

      return 0;
    });

    setPosts(sortedPosts);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts"),
      (snapshot) => {
        getAllPosts();
      },
      (error) => {
        console.log(error);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    toTop();
  }, []);

  const addLike = async (id) => {
    const result = await getDoc(doc(db, "posts", `${id}`));

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
        ref={flatListRef}
        contentContainerStyle={{ paddingTop: 32 }}
        showsVerticalScrollIndicator={false}
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
                  onPress={() => {
                    navigation.navigate("Map", {
                      location: item.location,
                      title: item.locationTitle,
                    }),
                      dispatch(pathSlice.actions.setPath({ path: route.name }));
                  }}
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
  },

  postImg: {
    height: 240,
    borderRadius: 16,
    marginBottom: 8,
  },
  postWrap: {
    marginBottom: 32,
    marginHorizontal: 16,
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
