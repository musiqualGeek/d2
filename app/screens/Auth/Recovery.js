import React, { useState, useEffect } from "react";
import {
  TextInput,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { images, COLORS } from "../../../constants";
import { Ionicons } from "@expo/vector-icons";
import { recoveryUser } from "../../../redux/User/user.actions";
import { useDispatch, useSelector } from "react-redux";

const mapState = ({ user }) => ({
  propertyRecoverySuccess: user.propertyRecoverySuccess,
  errors: user.errors,
});

const Recovery = ({ navigation }) => {
  const { propertyRecoverySuccess, errors } = useSelector(mapState);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (propertyRecoverySuccess) navigation.navigate("splash");
  }, [propertyRecoverySuccess]);

  const handleRecovery = () => {
    dispatch(recoveryUser(email));
  };

  return (
    <View style={styles.contaniner}>
      {/* Section 1 */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
          flexDirection: "column",
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{ paddingBottom: 20 }}
      >
        <View></View>
        <View style={styles.loginContainer}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={30} color="black" />
          </TouchableOpacity>
          <View style={styles.SubloginContainer}>
            <Text style={styles.title3}>Recovery Account</Text>
            <Text style={styles.title4}>Enter your Email</Text>
            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Adress</Text>
              <TextInput
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                placeholder="Email"
                placeholderTextColor={"grey"}
              />
            </View>
            <Text style={styles.fieldErrors}>{errors}</Text>
            {email.length > 0 ? (
              <TouchableOpacity style={styles.pinkBtn} onPress={handleRecovery}>
                <Text style={styles.textBtn}>Recover</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.disabledBtn}>
                <Text style={styles.textBtn}>Recover</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
      <ImageBackground style={styles.fixed} source={images.splash} />
    </View>
  );
};

export default Recovery;

const styles = StyleSheet.create({
  contaniner: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  signInContainer: {
    flexDirection: "row",
    marginVertical: 30,
  },
  title: {
    color: "#ededed",
    fontSize: 16,
  },
  title2: {
    fontSize: 16,
    color: COLORS.pink,
    fontWeight: "bold",
  },
  title3: {
    fontSize: 36,
    color: "black",
    fontWeight: "bold",
  },
  title4: {
    fontSize: 14,
    color: COLORS.grey,
    fontWeight: "bold",
    marginBottom: 40,
  },
  fixed: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  backBtn: {
    marginVertical: 10,
  },
  loginContainer: {
    justifyContent: "flex-end",
    backgroundColor: "white",
    width: 350,
    height: 400,
    borderRadius: 10,
    padding: 20,
  },
  SubloginContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    backgroundColor: COLORS.greyBg,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    width: "100%",
    color: "black",
    marginBottom: 0,
    fontSize: 16,
  },
  btn: {
    backgroundColor: COLORS.pink,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    width: 280,
    marginVertical: 20,
  },
  btnText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
  },
  forget: {
    backgroundColor: "white",
  },
  forgetText: {
    color: "black",
    fontSize: 16,
    marginVertical: 10,
  },
  inputContainer: {
    width: "100%",
    paddingHorizontal: 0,
  },
  label: {
    textAlign: "left",
    fontSize: 16,
    color: COLORS.greyColor,
    marginBottom: 10,
  },
  pinkBtn: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.pink,
    marginVertical: 10,
    borderRadius: 10,
  },
  disabledBtn: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.grey,
    marginVertical: 10,
    borderRadius: 10,
  },
  textBtn: {
    color: "white",
    fontSize: 24,
    textAlign: "center",
    paddingVertical: 8,
  },
  fieldErrors: {
    color: COLORS.pink,
    fontSize: 12,
    marginTop: 20,
  },
});
