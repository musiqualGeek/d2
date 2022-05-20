import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const BackBtn = (props) => {
  const { navigation } = props;
  return (
    <View style={styles.backContainer}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default BackBtn;

const styles = StyleSheet.create({
  backContainer: {
    backgroundColor: "#fff",
  },
  backBtn: {
    padding: 12,
  },
});
