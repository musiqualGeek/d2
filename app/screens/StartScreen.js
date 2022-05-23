import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { setKind } from "../../redux/Data/data.actions";
import BackBtn from "./Modal/BackBtn";

const StartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const handleNextScren0 = () => {
    navigation.push("readyScreen");
    dispatch(setKind("0"));
  };
  const handleNextScren1 = () => {
    navigation.push("readyScreen");
    dispatch(setKind("1"));
  };
  return (
    <View style={tw`flex flex-1`}>
      <BackBtn navigation={navigation} />
      <View style={tw`flex flex-1 justify-center items-center -mt-8`}>
        <Text style={tw`text-2xl m-4 mb-8`}>Please Select</Text>
        <View
          style={tw`flex flex-row justify-between items-center w-full px-4 overflow-hidden`}
        >
          <TouchableOpacity
            style={tw`p-2 pl-6 pb-8 pt-4 bg-gray-200 mr-2 w-36 rounded-lg`}
            onPress={handleNextScren0}
          >
            <View>
              <Image
                source={{ uri: "https://links.papareact.com/3pn" }}
                style={styles.image}
              />
              <View style={tw`flex-row items-center mt-3`}>
                <Text style={tw`text-base font-bold text-black`}>
                  Ride Delivery
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`p-2 pl-6 pb-8 pt-4 bg-gray-200 ml-2 w-36 rounded-lg`}
            onPress={handleNextScren1}
          >
            <View>
              <Image
                source={{
                  uri: "https://links.papareact.com/28w",
                }}
                style={styles.image}
              />
              <View style={tw`flex-row items-center mt-3`}>
                <Text style={tw`text-base font-bold text-black`}>
                  Home Delivery
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
});
