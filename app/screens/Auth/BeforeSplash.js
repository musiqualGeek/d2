import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { images } from "../../../constants";

const BeforeSplash = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("splash");
    }, 3000);
  }, []);
  return (
    <View style={styles.contaniner}>
      <Image style={styles.logo} source={images.Logo} resizeMode="contain" />
    </View>
  );
};

export default BeforeSplash;

const styles = StyleSheet.create({
  contaniner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  logo: {
    width: 150,
    height: 150,
  },
});
