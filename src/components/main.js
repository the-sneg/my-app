import { useEffect } from "react";
import { View, Dimensions, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { useRoute } from "../router";
import { auth } from "../firebase/config";
import { authStateChangeUser } from "../redux/auth/authOperations";

export const Main = () => {
  const { state } = useSelector((state) => state.auth);
  console.log("state", state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authStateChangeUser());
  }, []);

  const routing = useRoute(state);

  return <NavigationContainer>{routing}</NavigationContainer>;
};
