import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
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

const mapState = ({ user, data }) => ({
  userD: user.userD,
  userDocId: user.userDocId,
  origin: data.origin,
});

const data = [
  {
    id: "1224",
    title: "Get a ride",
    image: "https://links.papareact.com/3pn",
    screen: "MapScreen",
  },
  {
    id: "4354",
    title: "My Rides",
    image:
      "https://firebasestorage.googleapis.com/v0/b/d2app-74e2c.appspot.com/o/assets%2Frides.PNG?alt=media&token=0e8d2b1e-da95-4bb2-82e9-5bd781bb20b8",
    screen: "myOrders",
  },
];

const HomeScreen = () => {
  const { userD, userDocId, origin } = useSelector(mapState);
  const [kind, setKind] = useState("");
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
      <View style={tw`p-4`}>
        <Text style={styles.title1}>Welcome</Text>
        <Text style={styles.title2}>{userD.name}</Text>
        <Text style={styles.title1}></Text>
      </View>
      <View
        style={[
          tw`flex flex-row justify-between items-center w-full px-2 overflow-hidden`,
          { backgroundColor: "transparent" },
        ]}
      >
        <TouchableOpacity
          style={tw`p-2 pl-6 pb-8 pt-4 bg-gray-200 mx-4 w-36 rounded-lg`}
          onPress={() => navigation.push("startScreen")}
        >
          <View>
            <Image
              source={{ uri: "https://links.papareact.com/3pn" }}
              style={styles.image}
            />
            <View style={tw`flex-row items-center mt-3`}>
              <Text style={tw`text-base font-bold text-black`}>
                Get Started
              </Text>
              <Icon
                type="antdesign"
                name="arrowright"
                color="black"
                size={20}
                style={tw`ml-2`}
              />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`p-2 pl-6 pb-8 pt-4 bg-gray-200 mr-4 w-36 rounded-lg`}
          onPress={() => navigation.push("myOrders")}
        >
          <View>
            <Image
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/d2app-74e2c.appspot.com/o/assets%2Frides.PNG?alt=media&token=0e8d2b1e-da95-4bb2-82e9-5bd781bb20b8",
              }}
              style={styles.image}
            />
            <View style={tw`flex-row items-center mt-3`}>
              <Text style={tw`text-base font-bold text-black`}>My Orders</Text>
              <Icon
                type="antdesign"
                name="arrowright"
                color="black"
                size={20}
                style={tw`ml-2`}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
      {/* {kind.length === 0 ? (
        <View
          style={tw`flex flex-row justify-between items-center w-full px-4 overflow-hidden`}
        >
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={tw`p-2 pl-6 pb-8 pt-4 bg-gray-200 mr-4 w-40 rounded-lg`}
                onPress={() => navigation.push(item.screen)}
                disabled={!origin}
              >
                <View style={tw`${!origin && "opacity-30"}`}>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <View style={tw`flex-row items-center mt-3`}>
                    <Text style={tw`text-base font-bold text-black`}>
                      {item.title}
                    </Text>
                    <Icon
                      type="antdesign"
                      name="arrowright"
                      color="black"
                      size={20}
                      style={tw`ml-2`}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
          <View style={tw`bg-gray-200 mx-2 w-36 rounded-lg`}>
            <Text style={tw`text-center p-2`}>Ride</Text>
          </View>
          <View style={tw`bg-gray-200 mx-2 w-40 rounded-lg`}>
            <Text style={tw`text-center p-2`}>Delivery</Text>
          </View>
        </View>
      ) : (
        <></>
      )} */}
      {/* <View style={tw`rounded-lg mx-4 mt-4 mb-2`}>
        <GooglePlacesAutocomplete
          placeholder="Where you are now?"
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
      </View> */}
      {/* <View style={tw`p-4`}>
        <NavOptions />
        <NavFavourites />
      </View> */}
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
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
});

export default HomeScreen;
