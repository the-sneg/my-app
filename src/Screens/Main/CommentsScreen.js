import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from "react-native";

import { useSelector } from "react-redux";
import { db } from "../../firebase/config";
import {
  getDocs,
  collection,
  doc,
  onSnapshot,
  getDoc,
  addDoc,
  updateDoc,
  increment,
} from "firebase/firestore";

export default function CommentsScreen({ route }) {
  const { postId } = route.params;
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const { nickname, userId } = useSelector((state) => state.auth);

  useEffect(() => {
    getAllPosts();
  }, []);

  const createPost = async () => {
    const querySnapshot = await addDoc(
      collection(db, "posts", `${postId}`, "comments"),
      {
        comment,
        nickname,
        userId,
      }
    );
    await updateDoc(doc(db, "posts", `${postId}`), {
      comments: increment(1),
    });
  };

  const getAllPosts = async () => {
    const querySnapshot = await getDocs(
      collection(db, "posts", `${postId}`, "comments")
    );
    let comments = [];
    querySnapshot.forEach((doc) => {
      comments.push({ ...doc.data(), id: doc.id });
    });
    setAllComments(comments);
    console.log("comments", comments);
  };
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={allComments}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: item.userId === userId ? "row" : "row-reverse",
              }}
              onStartShouldSetResponder={() => true}
            >
              <View>
                <Text>{item.nickname}</Text>
                <Text>{item.comment}</Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
      <View>
        <TextInput style={styles.input} onChangeText={setComment}></TextInput>
      </View>
      <TouchableOpacity style={styles.publishWrap} onPress={createPost}>
        <Text style={styles.publish}>Опубликовать</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "flex-end",
  },
  input: {
    borderBottomWidth: 1,
    height: 50,
    fontSize: 16,
    borderColor: "#E8E8E8",
    marginBottom: 20,
  },
  publish: {
    color: "#BDBDBD",
    fontSize: 16,
  },
  publishWrap: {
    height: 51,
    backgroundColor: "#F6F6F6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    marginBottom: 50,
  },
});
