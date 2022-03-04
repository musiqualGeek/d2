import React from "react";
import { StyleSheet, Text, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import Screen from "../components/Screen";

const EatsScreen = () => {
  return (
    <Screen style={tw`bg-white h-full`}>
      <TouchableOpacity
        style={[
          tw`bg-white p-3 rounded-full shadow-lg`,
          {
            top: Constants.statusBarHeight,
            right: 20,
            position: "absolute",
            zIndex: 100,
          },
        ]}
        onPress={() => navigation.push("profile")}
      >
        <Icon
          type="antdesign"
          name="user"
          color="black"
          size={16}
          // style={}
        />
      </TouchableOpacity>
    </Screen>
  );
};

export default EatsScreen;

const styles = StyleSheet.create({});
