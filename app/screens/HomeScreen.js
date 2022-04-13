import React, { useEffect } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import Screen from "../components/Screen";
import tw from "tailwind-react-native-classnames";
import NavOptions from "../components/NavOptions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAP_APIKEY } from "@env";
import { useDispatch, useSelector } from "react-redux";
import { setDestination, setOrigin } from "../../redux/Data/data.actions";
import NavFavourites from "../components/NavFavourites";
import Constants from "expo-constants";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../firebase/utils";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { setUserD } from "../../redux/User/user.actions";

const mapState = ({ user }) => ({
  userD: user.userD,
  userDocId: user.userDocId,
});

const HomeScreen = () => {
  const { userD, userDocId } = useSelector(mapState);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      where("id", "==", auth.currentUser.uid)
    );
    const querySnapshot = onSnapshot(q, (snapshot) => {
      snapshot.docs.map((doc) => {
        dispatch(setUserD(doc.data(), doc.id));
      });
    });
    return () => {
      querySnapshot();
    };
  }, []);


  return (
    <Screen style={tw`bg-white h-full`}>
      <TouchableOpacity
        style={[
          tw`bg-white p-0 rounded-full shadow-lg`,
          {
            top: Constants.statusBarHeight,
            right: 20,
            position: "absolute",
            zIndex: 100,
          },
        ]}
        onPress={() => navigation.push("profile")}
      >
        <Image
          source={{ uri: userD.avatar }}
          style={{ width: 38, height: 38, borderRadius: 20 }}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View style={tw`p-5`}>
        <Text style={styles.title1}>Welcome</Text>
        <Text style={styles.title2}>{userD.name}</Text>
        <View style={tw`mb-3`}>
          <GooglePlacesAutocomplete
            placeholder="Where from?"
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={400}
            onPress={(data, details = null) => {
              dispatch(
                setOrigin({
                  loaction: details.geometry.location,
                  description: data.description,
                })
              );
              dispatch(setDestination(null));
            }}
            minLength={2}
            fetchDetails={true}
            returnKeyType={"search"}
            onFail={(error) => console.error(error)}
            query={{
              key: GOOGLE_MAP_APIKEY,
              language: "en",
            }}
            styles={{
              container: {
                flex: 0,
              },
              textInput: {
                fontSize: 15,
              },
            }}
            enablePoweredByContainer={false}
          />
        </View>
        <NavOptions />
        <NavFavourites />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title1: {
    fontSize: 16,
    color: "grey",
  },
  title2: {
    fontSize: 25,
    textTransform: "capitalize",
    marginBottom: 20,
  },
});

export default HomeScreen;
