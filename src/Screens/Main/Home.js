import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import PostScreen from "./PostsScreen";
import CreatePostScreen from "./CreatePostsScreen";
import ProfileScreen from "./ProfileScreen";

const MainTab = createBottomTabNavigator();
import { Feather } from "@expo/vector-icons";

export default function Home() {
  return (
    <MainTab.Navigator screenOptions={{ tabBarShowLabel: false }}>
      <MainTab.Screen
        options={{
          headerTitleAlign: "center",
          headerTitle: "Публикации",
          headerRight: ({ focused, color, size }) => (
            <Feather
              name="log-out"
              size={24}
              color="#BDBDBD"
              style={{ paddingRight: 16 }}
            />
          ),
          tabBarIcon: ({ focused: boolean, color: red, size: number }) => (
            <Feather name="grid" size={24} color="rgba(33, 33, 33, 0.8)" />
          ),
        }}
        name="Posts"
        component={PostScreen}
      />
      <MainTab.Screen
        options={{
          tabBarIcon: ({ focused: boolean, color: red, size: number }) => (
            <Feather style={style.plus} name="plus" size={24} color="#ffffff" />
          ),
        }}
        name="Create"
        component={CreatePostScreen}
      />
      <MainTab.Screen
        options={{
          tabBarIcon: ({ focused: boolean, color: red, size: number }) => (
            <Feather name="user" size={24} color="rgba(33, 33, 33, 0.8)" />
          ),
        }}
        name="Profile"
        component={ProfileScreen}
      />
    </MainTab.Navigator>
  );
}

const style = StyleSheet.create({
  plus: {
    backgroundColor: "#FF6C00",
    width: 70,
    height: 40,
    borderRadius: 20,
    textAlign: "center",
    textAlignVertical: "center",
  },
});
