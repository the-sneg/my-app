import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, Image, Button } from "react-native";

import DefaultPostScreen from "../NestedScreens/DefaultPostsScreen";
import CommentsScreen from "../NestedScreens/CommentsScreen";
import MapScreen from "../NestedScreens/MapScreen";

const NestedScreen = createStackNavigator();

export default function PostScreen() {
  return (
    <NestedScreen.Navigator>
      <NestedScreen.Screen name="DefaultScreen" component={DefaultPostScreen} />
      <NestedScreen.Screen name="Comments" component={CommentsScreen} />
      <NestedScreen.Screen name="Map" component={MapScreen} />
    </NestedScreen.Navigator>
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
