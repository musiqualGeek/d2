import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import Checkbox from "expo-checkbox";
import { COLORS } from "../../../constants";
import { Ionicons, Entypo } from "@expo/vector-icons";
import {
  signUpUser,
  resetAllAuthForms,
  ResetErrorsState,
} from "../../../redux/User/user.actions";
import { useSelector, useDispatch } from "react-redux";

const mapState = ({ user }) => ({
  propertySignUpSuccess: user.propertySignUpSuccess,
  errors: user.errors,
});

const RegisterDriver = ({ navigation }) => {
  console.log("Register Screen");
  const { propertySignUpSuccess, errors } = useSelector(mapState);
  const dispatch = useDispatch();
  dispatch(ResetErrorsState);

  const [firstName, onChangefirstName] = useState("");
  const [email, onChangeEmail] = useState("@gmail.com");
  const [password, onChangepassword] = useState("hellodude");
  const [isSelected, setSelected] = useState(false);
  const [isSecure, setIsSecure] = useState(true);
  const [iconPasswordName, setIconPasswordName] = useState("eye-with-line");
  const [error, setError] = useState([]);
  // Hnadle Errors
  const [firstNameErrors, setFirstNameErrors] = useState("");
  const [emailErrors, setEmailErrors] = useState("");
  const [passwordErrors, setPasswordErrors] = useState("");
  const [termsErrors, setTermsErrors] = useState("");

  const ResetForm = () => {
    onChangefirstName("");
    onChangeEmail("");
    onChangepassword("");
    setIsSecure(true);
    setIconPasswordName("eye");
    setSelected(false);
    setError([]);
  };

  const handlePasswordSecure = () => {
    setIsSecure(!isSecure);
    if (isSecure) {
      setIconPasswordName("eye-with-line");
    } else {
      setIconPasswordName("eye");
    }
  };

  useEffect(() => {
    if (propertySignUpSuccess) {
      ResetForm();
      dispatch(resetAllAuthForms());
    }
  }, [propertySignUpSuccess]);

  const handleRegister = async () => {
    var checking_form = "true";
    if (firstName.length === 0) {
      setFirstNameErrors("* First Name Field Required");
      checking_form = "false";
    } else {
      setFirstNameErrors("");
    }
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
    if (isSelected !== true) {
      setTermsErrors("* Agree to the Terms and Conditions is required");
      checking_form = "false";
    } else {
      setTermsErrors("");
    }
    if (checking_form === "true") {
      dispatch(signUpUser({ firstName, email, password, type: "1" }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.OContainer}>
        <View style={styles.contectContainer}>
          <View>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={30} color="black" />
            </TouchableOpacity>
            <View style={styles.SubloginContainer}>
              <Text style={styles.title3}>
                Register with{"\n"}Email address
              </Text>
              <Text style={styles.title32}>As A Driver</Text>
            </View>
          </View>
          <View style={styles.phoneStyle}>
            {/* Full Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangefirstName}
                value={firstName}
                placeholder="Full Name"
                placeholderTextColor={"grey"}
              />
              <Text style={styles.fieldErrors}>{firstNameErrors}</Text>
            </View>
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
            {/* Terms and Condition */}
            <View style={styles.inputContainer}>
              <View style={styles.terms}>
                <Checkbox
                  value={isSelected}
                  onValueChange={setSelected}
                  style={styles.checkbox}
                  color={setSelected ? COLORS.pink : undefined}
                />
                <Text style={styles.privacy}>
                  I agree with the privacy policies.
                </Text>
              </View>
            </View>
            <View style={styles.inputContainer}>
              {firstName && email && password && isSelected ? (
                <TouchableOpacity
                  style={styles.pinkBtn}
                  onPress={handleRegister}
                >
                  <Text style={styles.textBtn}>Register</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.disabledBtn}>
                  <Text style={styles.textBtn}>Register</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={[styles.fieldErrors, { marginTop: 10 }]}>
              {errors}
            </Text>
            <View style={styles.login}>
              <Text style={(styles.loginText, { color: COLORS.grey })}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("login")}>
                <Text style={(styles.loginText, { color: COLORS.pink })}>
                  sign in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterDriver;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  OContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 40,
  },
  contectContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  title3: {
    fontSize: 36,
    color: "black",
    fontWeight: "bold",
  },
  title4: {
    fontSize: 18,
    color: "black",
    fontWeight: "600",
    marginVertical: 20,
  },
  title4hidden: {
    display: "none",
  },
  backBtn: {
    marginVertical: 10,
    marginLeft: 20,
  },
  SubloginContainer: {
    backgroundColor: "white",
    marginVertical: 20,
    paddingHorizontal: 30,
  },
  phoneStyle: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 50,
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    paddingHorizontal: 30,
  },
  phoneInputStyle: {
    marginVertical: 20,
  },
  pinkBtn: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.pink,
    marginTop: 50,
    borderRadius: 10,
  },
  disabledBtn: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.grey,
    marginTop: 50,
    borderRadius: 10,
  },
  textBtn: {
    color: "white",
    fontSize: 24,
    textAlign: "center",
    paddingVertical: 8,
  },
  login: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    marginVertical: 10,
  },
  loginText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  input: {
    backgroundColor: COLORS.greyBg,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    width: "100%",
    color: "black",
    marginTop: 10,
    fontSize: 16,
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
    top: 22,
    fontSize: 22,
  },
  terms: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 5,
  },
  checkbox: {
    marginRight: 10,
    borderRadius: 0,
  },
  fieldErrors: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
  },
  label: {
    textAlign: "left",
    fontSize: 16,
    color: COLORS.greyColor,
    marginBottom: 10,
  },
});