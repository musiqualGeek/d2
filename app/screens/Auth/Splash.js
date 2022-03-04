import React from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { images, COLORS } from "../../../constants";

const Splash = ({ navigation }) => {
  return (
    <View style={styles.contaniner}>
      {/* logo */}
      <Image style={styles.logo} source={images.Logo} resizeMode="contain" />
      {/* Section 2 */}
      <View style={styles.section2Container}>
        <Text style={styles.section2}>Share your greatest moments</Text>
      </View>
      {/* Section 3 */}
      <View>
        <TouchableOpacity
          style={styles.fbConnect}
          onPress={() => navigation.navigate("login")}
        >
          <MaterialIcons name="directions-walk" size={25} color={COLORS.pink} />
          <Text style={styles.fbConnectTextStyle}>Start Booking a Ride</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.phConnect}
          onPress={() => navigation.navigate("loginDriver")}
        >
          <MaterialIcons name="local-taxi" size={24} color="white" />
          <Text style={styles.phConnectTextStyle}>
            Drive people in your City
          </Text>
        </TouchableOpacity>
      </View>
      <ImageBackground style={styles.fixed} source={images.splash} />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contaniner: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  signInContainer: {
    flexDirection: "row",
    marginVertical: 20,
  },
  title: {
    color: "#ededed",
    fontSize: 16,
  },
  title2: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  fixed: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  logo: {
    width: 80,
    height: 80,
    marginVertical: 100,
  },
  section2Container: {
    marginTop: 50,
  },
  section2: {
    textAlign: "center",
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 0,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 50,
    backgroundColor: "white",
    marginHorizontal: 5,
  },
  dot_active: {
    width: 12,
    height: 12,
    borderRadius: 50,
    backgroundColor: COLORS.pink,
    marginHorizontal: 5,
  },
  fbConnect: {
    width: 300,
    height: 40,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: "white",
    alignItems: "center",
    marginVertical: 8,
  },
  fbConnectTextStyle: {
    color: COLORS.pink,
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },
  phConnect: {
    width: 300,
    height: 40,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: COLORS.pink,
    alignItems: "center",
    marginVertical: 8,
  },
  phConnectTextStyle: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },
});