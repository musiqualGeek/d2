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
  Alert,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Screen from "../components/Screen";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/utils";
import { icons } from "../../constants";
import moment from "moment";
import BackBtn from "./Modal/BackBtn";

const mapState = ({ user }) => ({
  userD: user.userD,
  userDocId: user.userDocId,
});

const MyOrders = () => {
  console.log("here MyOrders");
  const { userD, userDocId } = useSelector(mapState);
  const navigation = useNavigation();
  const [orders, setOrders] = useState(null);
  const [selected, setSelected] = useState(null);
  const [driverData, setDriverData] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "orders"),
      where("userPassenger", "==", userDocId)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersT = [];
      querySnapshot.forEach((doc) => {
        ordersT.push(doc.data());
      });
      setOrders(ordersT);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log("userD => ", userD);
    console.log("Orders => ", orders);
    console.log("driverrrrrrrrrrrrrrr => ", driverData);
  }, [orders, driverData]);
  const handleCloseOrder = (id) => {
    const q = query(collection(db, "orders"), where("id", "==", id));
  };

  const logicRenderModel = async () => {
    if (selected?.userDriver?.length > 0) {
      const ref = doc(db, "users", selected.userDriver);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        setDriverData(docSnap.data());
        // driverData = docSnap.data();
      } else {
        console.log("No such document!");
      }
    }
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
              {!selected?.status ? (
                <View
                  style={[
                    tw`py-3 m-3 rounded-lg ${!selected && "bg-gray-300"}`,
                    {
                      backgroundColor: "#84CC16",
                    },
                  ]}
                >
                  <Text style={tw`text-center text-white text-base`}>
                    Waiting For Driver To Accept...
                  </Text>
                </View>
              ) : (
                <View style={{ flex: 1 }}>
                  <Image
                    source={{ uri: driverData?.driverPhoto }}
                    style={[styles.imgStyle]}
                    resizeMode="cover"
                  />
                </View>
              )}
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
                    Close Order
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
      <BackBtn navigation={navigation} />
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
        <Text style={styles.title2}>Your Orders</Text>
      </View>
      {orders?.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={tw`p-2 pb-4 pt-4 bg-gray-200 mr-4 mb-6 ml-4 rounded-lg`}
              onPress={() => {
                console.log("Clicked !!");
                setSelected(item);
                // setModalVisible(!isModalVisible);
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
                      {item.origin.description.length > 35
                        ? item.origin.description.substr(0, 35) + "..."
                        : item.origin.description}
                    </Text>
                  </View>
                  <View></View>
                  <View style={tw`flex flex-row`}>
                    <Text style={tw`text-xs w-10`}>To</Text>
                    <Text style={tw`text-xs font-bold`}>
                      {item.destination.description.length > 35
                        ? item.destination.description.substr(0, 35) + "..."
                        : item.destination.description}
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
                      item?.status === "open" ? icons.valid : icons.notValid
                    }
                    style={styles.icon}
                  />
                  <Text style={{ fontSize: 10 }}>
                    {item?.status === "open" ? "Open" : "Closed"}
                  </Text>
                  <Text></Text>
                </View>
              </View>
              <View>
                {item.createdAt && (
                  <Text style={tw`text-gray-600 text-xs text-right pr-2`}>
                    {moment(item.createdAt.toDate(), "YYYYMMDD").fromNow()}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <View style={styles.noChat}>
          <Text style={styles.noChatText1}>No Orders yet.</Text>
          <Text style={styles.noChatText2}>
            Start Your First by navigating to the home screen.
          </Text>
        </View>
      )}
      {selected && renderModel()}
    </Screen>
  );
};

export default MyOrders;

const styles = StyleSheet.create({
  title2: {
    fontSize: 25,
    textTransform: "capitalize",
    marginBottom: 20,
  },
  noChat: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    marginTop: "2%",
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
  },
  imgStyle: {
    width: 40,
    height: 40,
  },
  icon: {
    width: 20,
    height: 20,
  },
});
