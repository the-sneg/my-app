import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, Image, Button } from "react-native";

export default function CommentsScreen() {
  return (
    <View>
      <Text>CommentsScreen</Text>
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
