import React, { useState } from "react";

import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "./src/Screens/Auth/LoginScreen";
import RegistrationScreen from "./src/Screens/Auth/RegistrationScreen";

import Home from "./src/Screens/Main/Home";

const AuthStack = createStackNavigator();

export const useRoute = (isAuth) => {
  if (!isAuth) {
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <AuthStack.Screen
          options={{ headerShown: false }}
          name="Registration"
          component={RegistrationScreen}
        />

        <AuthStack.Screen
          options={{ headerShown: false }}
          name="Home"
          component={Home}
        />
      </AuthStack.Navigator>
    );
  }
};
