import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
} from "react-native";
import { useSelector } from "react-redux";

import { db } from "../../firebase/config";
import {
  getDocs,
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  increment,
} from "firebase/firestore";

import { Feather } from "@expo/vector-icons";

export default function CommentsScreen({ route }) {
  const { postId, image } = route.params;
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const { nickname, userId, avatar } = useSelector((state) => state.auth);

  const flatListRef = useRef();
  const toBot = () => {
    flatListRef.current.scrollToEnd({ animated: true });
  };
  useEffect(() => {
    toBot();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts"),
      (snapshot) => {
        getAllComments();
      },
      (error) => {
        console.log(error);
      }
    );
    return () => unsubscribe();
  }, []);

  const createComment = async () => {
    const date = new Date().toLocaleString();

    console.log("date", date);
    const querySnapshot = await addDoc(
      collection(db, "posts", `${postId}`, "comments"),
      {
        comment,
        nickname,
        userId,
        date,
        avatar,
      }
    );
    await updateDoc(doc(db, "posts", `${postId}`), {
      comments: increment(1),
    });
    toBot();
  };

  const getAllComments = async () => {
    const querySnapshot = await getDocs(
      collection(db, "posts", `${postId}`, "comments")
    );
    let allComments = [];
    querySnapshot.forEach((doc) => {
      allComments.push({ ...doc.data(), id: doc.id });
    });

    const sortedComments = allComments.sort(function (a, b) {
      if (a.date > b.date) {
        return 1;
      }
      if (a.date < b.date) {
        return -1;
      }

      return 0;
    });

    setAllComments(sortedComments);
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, marginHorizontal: 16 }}>
        <SafeAreaView style={styles.containerSafe}>
          <Image source={{ uri: image }} style={styles.postImg} />
          <FlatList
            ref={flatListRef}
            showsVerticalScrollIndicator={false}
            data={allComments}
            renderItem={({ item }) => (
              <View
                style={{
                  ...styles.commentWrap,
                  flexDirection: item.userId === userId ? "row" : "row-reverse",
                }}
                onStartShouldSetResponder={() => true}
              >
                <View style={styles.comment}>
                  <Text style={{ fontSize: 13, color: "#BDBDBD" }}>
                    {item.nickname}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#212121",
                      marginTop: 8,
                      marginBottom: 8,
                    }}
                  >
                    {item.comment}
                  </Text>
                  <Text style={{ fontSize: 10, color: "#BDBDBD" }}>
                    {item.date}
                  </Text>
                </View>
                <Image
                  source={{ uri: item.avatar }}
                  style={{
                    ...styles.avatar,
                    marginLeft: item.userId === userId ? 16 : 0,
                    marginRight: item.userId === userId ? 0 : 16,
                  }}
                ></Image>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </SafeAreaView>
        <View style={styles.submitCommentWrap}>
          <View>
            <TextInput
              style={styles.input}
              placeholder={"Комментировать..."}
              onChangeText={setComment}
            ></TextInput>
          </View>
          <TouchableOpacity style={styles.publishWrap} onPress={createComment}>
            <Feather
              name="arrow-up"
              size={24}
              color="#fff"
              style={styles.publish}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  containerSafe: {
    flex: 1,
  },
  input: {
    height: 30,
    fontSize: 16,
    borderColor: "#E8E8E8",
    marginBottom: 20,
    paddingLeft: 16,
  },
  submitCommentWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 50,
    borderRadius: 100,
    backgroundColor: "#F6F6F6",
    paddingTop: 10,
  },
  publishWrap: {
    position: "absolute",
    right: 8,
    top: 8,
    height: 34,
    width: 34,
    borderRadius: 50,
    backgroundColor: "#FF6C00",
    justifyContent: "center",
    alignItems: "center",
  },

  postImg: {
    height: 240,
    borderRadius: 8,
    marginBottom: 32,
    marginTop: 32,
    // display: "none",
  },
  commentWrap: {
    flexDirection: "row",
    marginBottom: 10,
    minHeight: 30,
  },
  comment: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 6,
    flex: 1,
    fontSize: 13,
    padding: 16,
  },
  avatar: {
    height: 28,
    width: 28,
    backgroundColor: "#515151",
    borderRadius: 28,
  },
});
