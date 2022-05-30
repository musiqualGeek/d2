import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  FontAwesome5,
  Ionicons,
  Octicons,
  AntDesign,
} from "@expo/vector-icons";
import { COLORS, icons } from "../../constants";
import { signOutUser } from "../../redux/User/user.actions";
import { useSelector, useDispatch } from "react-redux";
import BackBtn from "./Modal/BackBtn";

const mapState = ({ user }) => ({
  userD: user.userD,
});

const ProfileDriver = ({ navigation }) => {
  const { userD } = useSelector(mapState);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(signOutUser());
  };
  return (
    <View>
      <BackBtn navigation={navigation} />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.leftHeader}>
            <Image
              style={styles.profileImageStyle}
              source={{
                uri: userD?.avatar,
              }}
            />
          </View>
          <View style={styles.rightHeader}>
            <Text style={styles.nameStyle}>{userD?.name}</Text>
            <Text style={styles.tagStyle}>{`@${userD?.name}`}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("editProfile")}
            >
              <Text style={styles.editProfileStyle}>Edit profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView style={{ backgroundColor: "#f7f8fa" }}>
        <View style={styles.content}>
          <View style={styles.content2}>
            <TouchableOpacity
              style={[
                styles.itemStyle,
                {
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                },
              ]}
              onPress={() => navigation.navigate("driverPhoto")}
            >
              <View style={styles.itemleftStyle}>
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: "#fa2b53",
                      paddingLeft: 7.5,
                      paddingTop: 7,
                    },
                  ]}
                >
                  <Image
                    source={icons.i0}
                    style={{ tintColor: "white", width: 16, height: 16 }}
                  />
                </View>
                <Text style={styles.itemlListStyle}>Driver Photo</Text>
              </View>
              <AntDesign name="right" size={16} color="#c9c8ce" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.itemStyle]}
              onPress={() => navigation.navigate("driverLicense")}
            >
              <View style={styles.itemleftStyle}>
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: "#5cc7fd",
                      paddingLeft: 7,
                      paddingTop: 7,
                    },
                  ]}
                >
                  <Image
                    source={icons.i1}
                    style={{ tintColor: "white", width: 16, height: 16 }}
                  />
                </View>
                <Text style={styles.itemlListStyle}>Driver License</Text>
              </View>
              <AntDesign name="right" size={16} color="#c9c8ce" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.itemStyle,
                {
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                },
              ]}
              onPress={() => navigation.navigate("carLicensePlate")}
            >
              <View style={styles.itemleftStyle}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: "#94d74c", paddingLeft: 7 },
                  ]}
                >
                  <Image
                    source={icons.i2}
                    style={{ tintColor: "white", width: 16, height: 16 }}
                  />
                </View>
                <Text style={styles.itemlListStyle}>Car License Plate</Text>
              </View>
              <AntDesign name="right" size={16} color="#c9c8ce" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <ScrollView style={{ backgroundColor: "#f7f8fa" }}>
        <View style={styles.content}>
          <View style={styles.content2}>
            {/* <TouchableOpacity
              style={[
                styles.itemStyle,
                {
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  opacity: 0.5,
                },
              ]}
              disabled={true}
              onPress={() => navigation.navigate("wallet")}
            >
              <View style={styles.itemleftStyle}>
                <View
                  style={[styles.iconContainer, { backgroundColor: "#f8cc02" }]}
                >
                  <FontAwesome5 name="wallet" size={16} color="white" />
                </View>
                <Text style={styles.itemlListStyle}>My wallet</Text>
              </View>
              <AntDesign name="right" size={16} color="#c9c8ce" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.itemStyle, { opacity: 0.5 }]}
              onPress={() => navigation.navigate("blacklist")}
              disabled={true}
            >
              <View style={styles.itemleftStyle}>
                <View
                  style={[styles.iconContainer, { backgroundColor: "#f98910" }]}
                >
                  <Ionicons name="ios-document-text" size={16} color="white" />
                </View>
                <Text style={styles.itemlListStyle}>Blacklist</Text>
              </View>
              <AntDesign name="right" size={16} color="#c9c8ce" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.itemStyle,
                {
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                  opacity: 0.5,
                },
              ]}
              onPress={() => navigation.navigate("settings")}
              disabled={true}
            >
              <View style={styles.itemleftStyle}>
                <View
                  style={[styles.iconContainer, { backgroundColor: "#010101" }]}
                >
                  <Octicons name="gear" size={16} color="white" />
                </View>
                <Text style={styles.itemlListStyle}>Settings</Text>
              </View>
              <AntDesign name="right" size={16} color="#c9c8ce" />
            </TouchableOpacity> */}
            <TouchableOpacity
              style={[
                styles.itemStyle,
                { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
              ]}
              onPress={() => handleLogout()}
            >
              <View style={styles.itemleftStyle}>
                <View
                  style={[styles.iconContainer, { backgroundColor: "white" }]}
                >
                  <Octicons name="sign-out" size={16} color="#010101" />
                </View>
                <Text style={styles.itemlListStyle}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileDriver;

const styles = StyleSheet.create({
  header: {
    borderBottomColor: "#f1f1f3",
    borderBottomWidth: 2,
  },
  // Header Top
  headerTop: {
    backgroundColor: "white",
    padding: 20,
    paddingTop: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  leftHeader: {
    padding: 10,
  },
  profileImageStyle: {
    width: 120,
    height: 120,
    borderRadius: 5,
    marginRight: 10,
  },
  rightHeader: {
    padding: 0,
  },
  nameStyle: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    maxWidth: 220,
  },
  tagStyle: {
    color: "grey",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  editProfileStyle: {
    backgroundColor: COLORS.pink,
    borderRadius: 50,
    color: "white",
    fontSize: 14,
    paddingHorizontal: 15,
    paddingVertical: 2,
    marginVertical: 15,
    width: 100,
  },
  // Header Bottom
  headerBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    marginHorizontal: 40,
  },
  nbContainer: {
    alignItems: "center",
  },
  nbNumber: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  nbNumberLabel: {
    color: "#b6b8c4",
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
  },
  content: {
    flex: 1,
    backgroundColor: "#f7f8fa",
    padding: 20,
  },
  // Contact
  content1: {
    marginBottom: 20,
  },
  // Items
  itemStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderBottomColor: "#f1f1f3",
    borderBottomWidth: 0.5,
  },
  itemleftStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 50,
    paddingLeft: 8,
    paddingTop: 6,
    marginRight: 15,
  },
  itemlListStyle: {
    color: "#303340",
    fontSize: 15,
    fontWeight: "bold",
  },
});
