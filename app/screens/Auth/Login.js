import React, { useEffect, useState } from "react";
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
import { Ionicons, Entypo } from "@expo/vector-icons";
import {
  signInUser,
  resetAllAuthForms,
  ResetErrorsState,
} from "../../../redux/User/user.actions";
import { useDispatch, useSelector } from "react-redux";

const mapState = ({ user }) => ({
  propertySignInSuccess: user.propertySignInSuccess,
  errors: user.errors,
});

const Login = ({ navigation }) => {
  console.log("Loign Screen");
  const { propertySignInSuccess, errors } = useSelector(mapState);
  const dispatch = useDispatch();
  dispatch(ResetErrorsState);
  const [email, onChangeEmail] = useState("strange@gmail.com");
  const [password, onChangepassword] = useState("hellodude");
  const [isSecure, setIsSecure] = useState(true);
  const [iconPasswordName, setIconPasswordName] = useState("eye-with-line");
  const [emailErrors, setEmailErrors] = useState("");
  const [passwordErrors, setPasswordErrors] = useState("");

  const handlePasswordSecure = () => {
    setIsSecure(!isSecure);
    if (isSecure) {
      setIconPasswordName("eye-with-line");
    } else {
      setIconPasswordName("eye");
    }
  };

  useEffect(() => {
    if (propertySignInSuccess) {
      dispatch(resetAllAuthForms());
    }
  }, [propertySignInSuccess]);

  const handleLogin = async () => {
    var checking_form = "true";
    if (email.length === 0 || email.indexOf("@") === -1) {
      setEmailErrors("* Email Field Required");
      checking_form = "false";
    } else {
      setEmailErrors("");
    }
    if (password.length < 6) {
      setPasswordErrors("* Password Field Required, 6 caracter min");
      checking_form = "false";
    } else {
      setPasswordErrors("");
    }

    if (checking_form === "true") {
      dispatch(signInUser({ email, password }));
    }
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
        <View style={styles.contaniner}>
          <View style={styles.loginContainer}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={30} color="black" />
            </TouchableOpacity>
            <View style={styles.SubloginContainer}>
              <Text style={styles.title3}>Welcome back</Text>
              <Text style={styles.title4}>Login to your Passenger account</Text>
              {/* Email */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Adress</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={onChangeEmail}
                  value={email}
                  placeholder="Email"
                  placeholderTextColor={"grey"}
                />
                <Text style={styles.fieldErrors}>{emailErrors}</Text>
              </View>
              {/* Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordField}>
                  <TextInput
                    style={styles.input}
                    onChangeText={onChangepassword}
                    value={password}
                    secureTextEntry={isSecure}
                    placeholder="Password"
                    placeholderTextColor={"grey"}
                  />
                  <Entypo
                    style={styles.eyeIcon}
                    name={iconPasswordName}
                    size={25}
                    color={COLORS.main}
                    onPress={handlePasswordSecure}
                  />
                </View>
                <Text style={styles.fieldErrors}>{passwordErrors}</Text>
              </View>
              {email && password ? (
                <TouchableOpacity style={styles.pinkBtn} onPress={handleLogin}>
                  <Text style={styles.textBtn}>Sign In</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.disabledBtn}>
                  <Text style={styles.textBtn}>Sign In</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => {
                  console.log("Forget Clicked !!");
                  navigation.navigate("recovery");
                }}
                style={styles.forget}
              >
                <Text style={styles.forgetText}>Forget you password ?</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Bottom Line */}
          <View style={styles.signInContainer}>
            <Text style={styles.title}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("register")}>
              <Text style={styles.title2}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <ImageBackground style={styles.fixed} source={images.splash} />
    </View>
  );
};

export default Login;

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
    marginVertical: 0,
  },
  loginContainer: {
    backgroundColor: "white",
    width: 350,
    borderRadius: 10,
    padding: 20,
    marginTop: "60%",
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
  btnText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
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
  passwordField: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  eyeIcon: {
    position: "absolute",
    right: 20,
    top: 12,
    fontSize: 22,
  },
});
