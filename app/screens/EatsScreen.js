import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import Screen from "../components/Screen";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/utils";

const mapState = ({ user }) => ({
  userD: user.userD,
});

const EatsScreen = () => {
  const { userD } = useSelector(mapState);
  const navigation = useNavigation();

  useEffect(() => {
    // const q = query(collection(db, "orders"), where("closed", "==", "false"));
    // const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //   const cities = [];
    //   querySnapshot.forEach((doc) => {
    //     cities.push(doc.data().name);
    //   });
    //   console.log("Current cities in CA: ", cities.join(", "));
    // });
    // return () => {
    //   unsubscribe();
    // };
  }, []);
  return (
    <Screen style={tw`bg-white h-full`}>
      <TouchableOpacity
        style={[
          tw`bg-white p-0 rounded-full shadow-lg`,
          {
            top: Constants.statusBarHeight,
            right: 20,
            position: "absolute",
            zIndex: 100,
          },
        ]}
        onPress={() => navigation.push("profileDriver")}
      >
        <Image
          source={{ uri: userD.avatar }}
          style={{ width: 38, height: 38, borderRadius: 20 }}
        />
      </TouchableOpacity>
      <ScrollView></ScrollView>
    </Screen>
  );
};

export default EatsScreen;

const styles = StyleSheet.create({});
