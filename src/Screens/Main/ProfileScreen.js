import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { useSelector } from "react-redux";
import Svg, { Circle, Path } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";

import {
  collection,
  getDocs,
  getDoc,
  updateDoc,
  where,
  query,
  arrayRemove,
  arrayUnion,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { Feather, AntDesign, Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

export default function ProfileScreen({ navigation }) {
  const { userId, avatar, nickname } = useSelector((state) => state.auth);
  const [avatarChange, setAvatarChange] = useState(null);

  const [userPosts, setUserPosts] = useState([]);
  console.log("userPostss", userPosts);

  const isFocused = useIsFocused();

  useEffect(() => {
    getUserPosts();
  }, [userPosts, isFocused]);

  const getUserPosts = async () => {
    const q = query(collection(db, "posts"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    let newPosts = [];
    querySnapshot.forEach((doc) => {
      newPosts.push({ ...doc.data(), id: doc.id });
    });
    setUserPosts(newPosts);
  };

  const addLike = async (id) => {
    const result = await getDoc(doc(db, "posts", `${id}`));
    console.log("result", result);
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
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatarChange(result.assets[0].uri);
      setAvatarChange((prevState) => ({
        ...prevState,
        avatar: result.assets[0].uri,
      }));
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.background}
        source={require("../../../assets/img/background.png")}
      >
        <View style={styles.avatarWrap}>
          <View style={styles.avatarBox}>
            <Image
              style={{ height: "100%", width: "100%", borderRadius: 16 }}
              source={{ uri: avatar }}
            ></Image>
            <TouchableOpacity style={styles.addBtnBox} onPress={pickImage}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="none"
                viewBox="0 0 25 25"
              >
                <Circle
                  cx="12.5"
                  cy="12.5"
                  r="12"
                  fill="none"
                  stroke="#FF6C00"
                ></Circle>
                <Path
                  fill="#FF6C00"
                  fillRule="evenodd"
                  d="M13 6h-1v6H6v1h6v6h1v-6h6v-1h-6V6z"
                  clipRule="evenodd"
                ></Path>
              </Svg>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "#fff",
            marginTop: 100,
            height: 100,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Text style={styles.nickname}>{nickname}</Text>
        </View>
        <FlatList
          style={{
            backgroundColor: "#fff",
          }}
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
                      navigation.navigate("Comments", {
                        postId: item.id,
                        image: item.image,
                      })
                    }
                  >
                    <Text style={styles.commentsTitle}>{item.comments}</Text>

                    {item.comments > 0 ? (
                      <Ionicons
                        name="md-chatbubble-sharp"
                        size={24}
                        color="#FF6C00"
                      />
                    ) : (
                      <Feather
                        name="message-circle"
                        size={24}
                        color="#BDBDBD"
                      />
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
                    <Text style={styles.locationTitle}>
                      {item.locationTitle}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          )}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  avatarWrap: {
    position: "absolute",
    right: 0,
    left: 0,
    top: 30,
    alignItems: "center",
    zIndex: 1,
  },
  avatarBox: {
    height: 120,
    width: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
  },
  addBtnBox: {
    position: "absolute",
    right: -12,
    bottom: 14,
  },
  nickname: {
    fontSize: 20,
    color: "#212121",
    marginBottom: 15,
  },
  postImg: {
    height: 240,
    borderRadius: 16,
    marginBottom: 8,
  },
  postWrap: {
    marginTop: 32,
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
