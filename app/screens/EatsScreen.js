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
} from "react-native";
import tw from "tailwind-react-native-classnames";
import Screen from "../components/Screen";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { icons } from "../../constants";
import moment from 'moment';
import Modal from "react-native-modal";
import * as WebBrowser from "expo-web-browser";

const mapState = ({ user }) => ({
  userD: user.userD,
});

const EatsScreen = () => {
  const { userD } = useSelector(mapState);
  const [orders, setOrders] = useState(null);
  const navigation = useNavigation();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "orders"), where("closedAt", "==", null));
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
    console.log("orders", orders)
  }, [orders])

  const handleCloseOrder = (id) => {
    const q = query(collection(db, "orders"), where("id", "==", id));
  };
  const handleRoute = () => {
    WebBrowser.openBrowserAsync(`https://www.google.com/maps/dir/?api=1&origin&destination=${selected.destination.location.lat}%2C${selected.destination.location.lng}&travelmode=driving`);
  }
  const renderModel = () => {
    return (
      <Modal
        isVisible={selected ? true : false}
        backdropOpacity={0.5}
        // onBackdropPress={() => setModalVisible(false)}
        onBackdropPress={() => setSelected(null)}
        // swipeDirection={["down"]}
        // scrollOffsetMax={400 - 300} // content height - ScrollView height
        propagateSwipe={true}
        style={styles.modal}
      >
        {selected && (
          <View style={styles.modelStyle}>
            <Image
              source={{ uri: userD.avatar }}
              style={[tw`shadow-lg`, styles.avatar]}
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
              <TouchableOpacity
                onPress={() => handleRoute()}
                style={[
                  tw`py-3 m-3 rounded-lg ${!selected && "bg-gray-300"}`,
                  {
                    backgroundColor:
                      selected?.status === "open"
                        ? "#84CC16"
                        : "#DC2626",
                  },
                ]}
                >
                <Text style={tw`text-center text-white text-base`}>
                  {selected?.status
                    ? "Accept Order"
                    : "Closed"}
                </Text>
              </TouchableOpacity>
              {selected?.status === "open" &&(
                <TouchableOpacity
                onPress={handleCloseOrder}
                style={[
                  tw`py-3 m-3 rounded-lg ${!selected && "bg-gray-300"}`,
                  {
                    backgroundColor: "#DC2626"
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
                console.log("Clicked !!");
                setSelected(item);
                // setModalVisible(!isModalVisible);
              }}
            >
              <View style={tw`flex flex-row`}>
                <View style={{ width: "14%", paddingTop: 5, }}>
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
                    {item?.status === "op en" ? "Open" : "Closed"}
                  </Text>
                  <Text></Text>
                </View>
              </View>
              <View>
                {item.createdAt && (
                  <Text style={tw`text-gray-600 text-xs text-right pr-2`} >{moment(item.createdAt.toDate(), "YYYYMMDD").fromNow()}</Text>
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
    flex: 0.55,
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
  icon: {
    width: 20,
    height: 20,
  },
});
