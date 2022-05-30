import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants";
import { storage, db } from "../../firebase/utils";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as DocumentPicker from "expo-document-picker";
import uuid from "react-native-uuid";
import { useSelector } from "react-redux";
import BackBtn from "./Modal/BackBtn";

const mapState = ({ user }) => ({
  userD: user.userD,
  userDocId: user.userDocId,
});

const EditProfile = ({ navigation }) => {
  const { userD, userDocId } = useSelector(mapState);
  const [avatar, setAvatar] = useState(userD?.avatar);
  const [firstName, setFirstName] = useState(userD?.name);

  const updateAvatarUser = async (downloadURL) => {
    const userRef = doc(db, "users", userDocId);
    await updateDoc(userRef, {
      avatar: downloadURL,
      updatedAt: new Date(),
    })
      .then(() => {
        console.log("Avatar switched !!");
      })
      .catch((err) => console.error(err));
  };
  const handleUpload = async () => {
    if (avatar.length > 0) {
      const url_uuid = uuid.v4();
      const storageRef = ref(storage, `${userD?.email}/${url_uuid}.png`);
      try {
        const r = await fetch(avatar);
        const b = await r.blob();
        uploadBytes(storageRef, b)
          .then(() => {
            getDownloadURL(storageRef).then(async (downloadURL) => {
              updateAvatarUser(downloadURL);
            });
          })
          .catch((error) => {
            console.log("catch", error);
          });
      } catch (error) {
        console.log("Catch ", error);
      }
    }
    if (firstName !== userD?.name) {
      const userRef = doc(db, "users", userDocId);
      await updateDoc(userRef, {
        name: firstName,
        updatedAt: new Date(),
      })
        .then(() => {
          console.log("FirstName switched !!");
        })
        .catch((err) => console.error(err));
    }
    navigation.goBack();
  };
  const handleChangePicture = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: "image/*" });
    setAvatar(result.uri);
  };
  const handleSubmit = async () => {
    if (avatar.length !== 0 || firstName !== userD?.name) {
      await handleUpload();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <BackBtn navigation={navigation} />
      <ScrollView style={styles.scrollView}>
        {/* Profile Picture */}
        <View style={styles.pictureContainer}>
          <TouchableOpacity
            style={styles.picture}
            onPress={handleChangePicture}
          >
            <Image
              style={styles.picture}
              source={{
                uri: avatar,
              }}
            />
            <View style={styles.editBtn}></View>
            <Text style={styles.editBtnTitle}>Edit Profile Picture</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          {/* First Name */}
          <View style={styles.detailsContainer}>
            <View style={[styles.searchContainer, styles.shadow]}>
              <Text style={styles.title4}>Full Name</Text>
              <TextInput
                style={styles.searchInput}
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
          </View>
          {/* Email */}
          <View style={styles.detailsContainer}>
            <View style={[styles.searchContainer, styles.shadow]}>
              <Text style={styles.title4}>Email</Text>
              {/* <TextInput style={styles.searchInput} value={userD?.email} /> */}
              <Text style={[styles.searchInput, { color: "black" }]}>
                {userD?.email}
              </Text>
            </View>
          </View>
          {/* Email */}
          {/* <View style={styles.detailsContainer}>
            <View style={[styles.searchContainer, styles.shadow]}>
              <Text style={styles.title4}>Phone Number</Text>
              <TextInput
                style={styles.searchInput}
                value={userD?.phone || "No phone Number connected."}
              />
            </View>
          </View> */}
          <TouchableOpacity style={styles.pinkBtn} onPress={handleSubmit}>
            <Text style={styles.textBtn}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.greyBg,
  },
  pictureContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  picture: {
    width: 120,
    height: 120,
    borderRadius: 5,
    marginRight: 10,
  },
  editBtn: {
    marginTop: -25,
    backgroundColor: "#2e2e2e",
    height: 25,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    opacity: 0.6,
  },
  editBtnTitle: {
    marginTop: -20,
    color: "white",
    fontSize: 13,
    paddingLeft: 5,
  },
  //   Details
  content: {
    padding: 10,
  },
  detailsContainer: {},
  title4: {
    color: COLORS.fontColor4,
    fontSize: 10,
  },
  searchContainer: {
    backgroundColor: "white",
    color: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  searchInput: {
    fontSize: 18,
  },
  shadow: {
    shadowColor: "#cdcddd",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0,
    shadowRadius: 2,
    elevation: 2,
  },
  pinkBtn: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.pink,
    borderRadius: 8,
  },
  textBtn: {
    color: "white",
    fontSize: 24,
    textAlign: "center",
    paddingVertical: 8,
  },
});
