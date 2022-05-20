import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
  TextInput,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import Screen from "../components/Screen";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { icons } from "../../constants";
import moment from "moment";
import Modal from "react-native-modal";
import * as WebBrowser from "expo-web-browser";
import { auth, db } from "../../firebase/utils";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { setUserD } from "../../redux/User/user.actions";

const mapState = ({ user }) => ({
  userD: user.userD,
  userDocId: user.userDocId,
});

const EatsScreen = () => {
  const { userD, userDocId } = useSelector(mapState);
  const dispatch = useDispatch();
  const [orders, setOrders] = useState(null);
  const navigation = useNavigation();
  const [selected, setSelected] = useState(null);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [rtTripProgress, setRtTripProgress] = useState("");

  useEffect(() => {
    const q = query(collection(db, "orders"), where("closedAt", "==", null));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersT = [];
      querySnapshot.forEach((doc) => {
        ordersT.push({ data: doc.data(), id: doc.id });
      });
      setOrders(ordersT);
    });
    return () => {
      unsubscribe();
    };
  }, []);

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

  useEffect(() => {
    console.log("userD");
    console.log(userD);
    console.log(userDocId);
  }, [userD]);

  useEffect(() => {
    console.log("orders", selected);
  }, [selected]);

  const handleCloseOrder = (id) => {
    const q = query(collection(db, "orders"), where("id", "==", id));
  };
  const handleRoute = async (item) => {
    console.log("Selected => ", item);
    await WebBrowser.openBrowserAsync(
      `https://www.google.com/maps/dir/?api=1&origin&destination=${item.lat.toString()}%2C${item.lng.toString()}&travelmode=driving`
    );
  };
  const handleShareTripProgress = async () => {
    console.log("id doc =>", selectedDocId);
    const userRef = doc(db, "orders", selectedDocId);
    let rtTripProgress2 = rtTripProgress.substr(
      rtTripProgress.indexOf("https"),
      rtTripProgress.length - rtTripProgress.indexOf("https") + 1
    );
    await updateDoc(userRef, {
      tripProgress: rtTripProgress2,
      userDriver: userDocId,
      updatedAt: new Date(),
    })
      .then(() => {
        console.log("rtTripProgress Updated !!");
      })
      .catch((err) => {
        console.log("error => handleShareTripProgress");
        console.error(err);
      });
  };
  const renderModel = () => {
    return (
      <Modal
        isVisible={selected ? true : false}
        backdropOpacity={0.5}
        onBackdropPress={() => setSelected(null)}
        propagateSwipe={true}
        style={styles.modal}
      >
        {selected && (
          <View style={styles.modelStyle}>
            <Image
              source={{ uri: userD.avatar }}
              style={[styles.avatar]}
              resizeMode="cover"
            />
            <ScrollView
              style={tw`max-w-lg`}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.modelTitle}>{userD.name}</Text>
              <View style={tw`flex flex-row justify-around mt-6`}>
                <View
                  style={tw`p-2 pb-2 pt-2 bg-gray-200 mr-2 ml-4 mb-4 mt-2 rounded-lg w-24 flex justify-center items-center`}
                >
                  <Text>Distance</Text>
                  <Text style={tw`text-lg font-bold`}>{selected.distance}</Text>
                </View>
                <View
                  style={tw`p-2 pb-2 pt-2 bg-gray-200 mr-2 ml-4 mb-4 mt-2 rounded-lg w-24 flex justify-center items-center`}
                >
                  <Text>Price</Text>
                  <Text style={tw`text-lg font-bold`}>${selected.price}</Text>
                </View>
                <View
                  style={tw`p-2 pb-2 pt-2 bg-gray-200 mr-2 ml-4 mb-4 mt-2 rounded-lg w-24 flex justify-center items-center`}
                >
                  <Text>Duration</Text>
                  <Text style={tw`text-lg font-bold`}>
                    {selected.travelTime}
                  </Text>
                </View>
              </View>
              <View
                style={tw`p-2 pl-4 pb-6 pt-4 bg-gray-200 mr-2 mb-4 ml-4 rounded-lg`}
              >
                <Text style={tw`text-xs font-bold`}>From: </Text>
                <Text style={styles.contactNumber}>
                  {selected.origin.description}
                </Text>
              </View>
              <View
                style={tw`p-2 pl-4 pb-6 pt-4 bg-gray-200 mr-2 mb-4 ml-4 rounded-lg`}
              >
                <Text style={tw`text-xs font-bold`}>To: </Text>
                <Text style={styles.contactNumber}>
                  {selected.destination.description}
                </Text>
              </View>
              <View
                style={tw`relative p-2 pl-4 pb-6 pt-4 bg-gray-200 mr-2 mb-4 ml-4 rounded-lg`}
              >
                <TextInput
                  style={tw`pr-8`}
                  value={
                    rtTripProgress.length > 0
                      ? selected.tripProgress
                      : rtTripProgress
                  }
                  onChangeText={setRtTripProgress}
                  placeholder="Paste Real Time Trip Progress Here ..."
                  placeholderTextColor={"grey"}
                />
                <TouchableOpacity
                  style={tw`absolute right-4 top-6`}
                  onPress={handleShareTripProgress}
                >
                  <Image
                    style={[
                      styles.sendIcon,
                      rtTripProgress.length > 0
                        ? { tintColor: "#84CC16" }
                        : { tintColor: "black" },
                    ]}
                    source={icons.send}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <Text style={tw`p-2 pl-4`}>
                Before Starting the drive please share the trip progress with
                the passenger
              </Text>
              <TouchableOpacity
                onPress={() => {
                  handleRoute(selected.destination.loaction);
                }}
                style={[
                  tw`py-3 m-3 rounded-lg ${!selected && "bg-gray-300"}`,
                  {
                    backgroundColor:
                      selected?.status === "open" ? "#84CC16" : "#DC2626",
                  },
                ]}
              >
                <Text style={tw`text-center text-white text-base`}>
                  {selected?.status ? "Share trip progress" : "Closed"}
                </Text>
              </TouchableOpacity>
              <Text style={tw`p-2 pl-4`}>Then you can start Driving ahead</Text>
              <TouchableOpacity
                onPress={() => {
                  handleRoute(selected.destination.loaction);
                }}
                style={[
                  tw`py-3 m-3 rounded-lg ${!selected && "bg-gray-300"}`,
                  {
                    backgroundColor:
                      selected?.status === "open" ? "#84CC16" : "#DC2626",
                  },
                ]}
              >
                <Text style={tw`text-center text-white text-base`}>
                  {selected?.status ? "Accept Order" : "Closed"}
                </Text>
              </TouchableOpacity>
              {selected?.status === "open" && (
                <TouchableOpacity
                  onPress={handleCloseOrder}
                  style={[
                    tw`py-3 m-3 rounded-lg ${!selected && "bg-gray-300"}`,
                    {
                      backgroundColor: "#DC2626",
                    },
                  ]}
                >
                  <Text style={tw`text-center text-white text-base`}>
                    Cancel Order
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        )}
      </Modal>
    );
  };
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
        onPress={() => navigation.push("profileDriver")}
      >
        <Image
          source={{ uri: userD.avatar }}
          style={{ width: 38, height: 38, borderRadius: 20 }}
        />
      </TouchableOpacity>
      <View style={tw`p-5`}>
        <Text style={styles.title2}>Orders</Text>
      </View>
      {orders?.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={tw`p-2 pb-6 pt-4 bg-gray-200 mr-4 mb-6 ml-4 rounded-lg`}
              onPress={() => {
                setSelected(item.data);
                setSelectedDocId(item.id);
              }}
            >
              <View style={tw`flex flex-row`}>
                <View style={{ width: "14%", paddingTop: 5 }}>
                  <MaterialCommunityIcons
                    name="ray-start-arrow"
                    size={42}
                    color="black"
                    style={styles.icon1}
                  />
                </View>
                <View style={{ width: "74%" }}>
                  <View style={tw`flex flex-row mb-3`}>
                    <Text style={tw`text-xs w-10`}>From</Text>
                    <Text style={tw`text-xs font-bold`}>
                      {item.data.origin.description.length > 35
                        ? item.data.origin.description.substr(0, 35) + "..."
                        : item.data.origin.description}
                    </Text>
                  </View>
                  <View></View>
                  <View style={tw`flex flex-row`}>
                    <Text style={tw`text-xs w-10`}>To</Text>
                    <Text style={tw`text-xs font-bold`}>
                      {item.data.destination.description.length > 35
                        ? item.data.destination.description.substr(0, 35) +
                          "..."
                        : item.data.destination.description}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: "10%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={
                      item.data?.status === "open"
                        ? icons.valid
                        : icons.notValid
                    }
                    style={styles.icon}
                  />
                  <Text style={{ fontSize: 10 }}>
                    {item.data?.status === "Open" ? "Open" : "Closed"}
                  </Text>
                  <Text></Text>
                </View>
              </View>
              <View>
                {item.data.createdAt && (
                  <Text style={tw`text-gray-600 text-xs text-right pr-2`}>
                    {moment(item.data.createdAt.toDate(), "YYYYMMDD").fromNow()}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.data.id.toString()}
        />
      ) : (
        <View style={styles.noChat}>
          <Text style={styles.noChatText1}>No Orders yet.</Text>
          <Text style={styles.noChatText2}>
            Start Your First by navigating to the home screen.
          </Text>
        </View>
      )}
      {renderModel()}
    </Screen>
  );
};

export default EatsScreen;

const styles = StyleSheet.create({
  title2: {
    fontSize: 25,
    textTransform: "capitalize",
    marginBottom: 20,
  },
  noChat: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10%",
  },
  noChatText1: {
    textAlign: "center",
    fontSize: 16,
    color: "black",
    maxWidth: "80%",
    marginBottom: 10,
  },
  noChatText2: {
    textAlign: "center",
    fontSize: 12,
    color: "black",
    maxWidth: "80%",
  },
  icon1: {
    transform: [{ rotate: "90deg" }],
  },
  modelStyle: {
    flex: 0.8,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 25,
    paddingTop: 25,
    overflow: "scroll",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
    overflow: "scroll",
  },
  modelTitle: {
    fontSize: 24,
    color: "black",
    textAlign: "center",
    marginTop: 20,
    textTransform: "capitalize",
  },
  avatar: {
    position: "absolute",
    top: "-12.5%",
    left: "44%",
    width: Dimensions.get("window").width / 4,
    height: Dimensions.get("window").width / 4,
    borderRadius: 50,
    zIndex: 10,
  },
  icon: {
    width: 20,
    height: 20,
  },
  sendIcon: {
    width: 20,
    height: 20,
  },
});
