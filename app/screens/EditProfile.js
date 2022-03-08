import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { COLORS } from "../../constants";
import { storage, db } from "../../firebase/utils";
import {
  doc,
  updateDoc,
  getDoc,
  getDocs,
  setDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as DocumentPicker from "expo-document-picker";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";

const mapState = ({ user }) => ({
  userD: user.userD,
});

const EditProfile = ({ navigation, route }) => {
  const { userD } = useSelector(mapState);
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState("");
  const [firstName, setFirstName] = useState(route.params.user?.name);
  const [userSearchTable, setUserSearchTable] = useState(null);
  const [downloadableUrl, setDownloadableUrl] = useState(null);
  useEffect(() => {
    console.log("Params id: ", route.params.userId);
    console.log("Params: ", route.params.user);
  }, []);

  const updateAvatarUser = async (downloadURL) => {
    const userRef = doc(db, "users", route.params.userId);
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
      const storageRef = ref(
        storage,
        `${route.params.user?.email}/${url_uuid}.png`
      );
      try {
        const r = await fetch(avatar);
        const b = await r.blob();
        uploadBytes(storageRef, b)
          .then(() => {
            getDownloadURL(storageRef).then(async (downloadURL) => {
              setDownloadableUrl(downloadURL);
              console.log("Line 93", downloadURL);
              updateAvatarUser(downloadURL);
              console.log("Line 96");
            });
          })
          .catch((error) => {
            console.log("Error LINE 89 =>", error);
          });
      } catch (error) {
        console.log("Catch ===============");
      }
    }
    if (firstName !== route.params.user?.name) {
      const userRef = doc(db, "users", route.params.userId);
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
    console.log("Response2 =>", result);
    setAvatar(result.uri);
  };
  const handleSubmit = async () => {
    if (avatar.length !== 0 || firstName !== route.params.user?.name) {
      await handleUpload();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
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
                uri: userD.avatar,
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
              <Text style={styles.title4}>First Name</Text>
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
              <TextInput
                style={styles.searchInput}
                value={route.params.user?.email}
              />
            </View>
          </View>
          {/* Email */}
          <View style={styles.detailsContainer}>
            <View style={[styles.searchContainer, styles.shadow]}>
              <Text style={styles.title4}>Phone Number</Text>
              <TextInput
                style={styles.searchInput}
                value={route.params.user?.phone || "No phone Number connected."}
              />
            </View>
          </View>
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
