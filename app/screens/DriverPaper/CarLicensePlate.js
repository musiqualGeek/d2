import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { COLORS } from "../../../constants";
import { storage, db } from "../../../firebase/utils";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as DocumentPicker from "expo-document-picker";
import uuid from "react-native-uuid";
import { useSelector } from "react-redux";

const mapState = ({ user }) => ({
  userD: user.userD,
  userDocId: user.userDocId,
});

const CarLicensePlate = ({ navigation }) => {
  const { userD, userDocId } = useSelector(mapState);
  const [avatar, setAvatar] = useState(userD?.carLicensePlate);

  const updateAvatarUser = async (downloadURL) => {
    const userRef = doc(db, "users", userDocId);
    await updateDoc(userRef, {
      carLicensePlate: downloadURL,
      updatedAt: new Date(),
    })
      .then(() => {
        console.log("CarLicensePlate switched !!");
      })
      .catch((err) => console.error(err));
  };
  const handleUpload = async () => {
    if (avatar.length > 0) {
      const url_uuid = uuid.v4();
      const storageRef = ref(
        storage,
        `${userD?.email}/carLicensePlate/${url_uuid}.png`
      );
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
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Car License Plate</Text>
        {/* Profile Picture */}
        <View style={styles.pictureContainer}>
          <TouchableOpacity
            style={styles.pictureT}
            onPress={handleChangePicture}
          >
            {avatar.length > 0 ? (
              <Image
                style={styles.picture}
                source={{
                  uri: avatar,
                }}
              />
            ) : (
              <Image
                style={styles.picture}
                source={{
                  uri: "https://firebasestorage.googleapis.com/v0/b/d2app-74e2c.appspot.com/o/placeholder.png?alt=media&token=fccda0f3-6a61-4270-9635-d04c65a64a51",
                }}
              />
            )}
            <View style={styles.editBtn}></View>
            <Text style={styles.editBtnTitle}>Edit Car License Plate</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.pinkBtn} onPress={handleSubmit}>
          <Text style={styles.textBtn}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CarLicensePlate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.greyBg,
    paddingHorizontal: 10,
    paddingTop: 30,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
  },
  pictureContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  pictureT: {
    width: "100%",
    borderRadius: 5,
  },
  picture: {
    width: "100%",
    height: 200,
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
    paddingLeft: (Dimensions.get("window").width - 20) / 2.7,
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
