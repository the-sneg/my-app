import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import PostScreen from "./PostsScreen";
import CreatePostScreen from "./CreatePostsScreen";
import ProfileScreen from "./ProfileScreen";
import CommentsScreen from "./CommentsScreen";
import MapScreen from "./MapScreen";

const MainTab = createBottomTabNavigator();
import { Feather } from "@expo/vector-icons";

export default function Home() {
  return (
    <MainTab.Navigator
      screenOptions={{ tabBarShowLabel: false }}
      // backBehavior="order"
    >
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
          tabBarStyle: { display: "none" },
          headerTitleAlign: "center",
          headerTitle: "Создать публикацию",
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
      <MainTab.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity>
              <Feather
                name="arrow-left"
                size={24}
                color="black"
                style={{ marginLeft: 16 }}
              />
            </TouchableOpacity>
          ),
          headerTitleAlign: "center",
          headerTitle: "Комментарии",
          tabBarButton: () => null,
          tabBarVisible: false,
          tabBarStyle: { display: "none" },
        }}
        name="Comments"
        component={CommentsScreen}
      />
      <MainTab.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity>
              <Feather
                name="arrow-left"
                size={24}
                color="black"
                style={{ marginLeft: 16 }}
              />
            </TouchableOpacity>
          ),
          headerTitleAlign: "center",
          headerTitle: "Карта",
          tabBarButton: () => null,
          tabBarVisible: false,
          tabBarStyle: { display: "none" },
        }}
        name="Map"
        component={MapScreen}
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
