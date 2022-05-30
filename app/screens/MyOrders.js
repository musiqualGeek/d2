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
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase/utils";
import { icons } from "../../constants";
import moment from "moment";
import BackBtn from "./Modal/BackBtn";
import * as WebBrowser from "expo-web-browser";
import ImageView from "react-native-image-viewing";

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
  const [visible, setIsVisible] = useState(false);
  const [images, setImges] = useState([]);

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

  useEffect(async () => {
    console.log("here Line 65");
    if (selected?.userDriver?.length > 0) {
      console.log("here line 67");
      const ref = doc(db, "users", selected.userDriver);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        setDriverData(docSnap.data());
        console.log("docSnap.data()");
        console.log(docSnap.data());
      } else {
        console.log("No such document!");
      }
    }
    if (driverData && selected?.confirmPhoto) {
      setImges([
        { uri: driverData.avatar },
        { uri: driverData.carLicensePlate },
        { uri: driverData.driverLicense },
        { uri: driverData.driverPhoto },
        { uri: selected?.confirmPhoto },
      ]);
    }
  }, [selected, driverData]);

  useEffect(() => {
    // console.log("userD => ", userD);
    // console.log("Orders => ", orders);
    console.log("driverrrrrrrrrrrrrrr => ", driverData);
  }, [orders, driverData]);
  const handleCloseOrder = (id) => {
    const q = query(
      collection(db, "orders"),
      where("id", "==", id),
      orderBy("createdAt")
    );
  };

  const logicRenderModel = async () => {
    console.log("here");
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
    console.log("renderModel");
    console.log(selected);
    const handletripProgress = async (item) => {
      await WebBrowser.openBrowserAsync(item);
    };
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
              <View style={tw`flex flex-row justify-start items-center p-2`}>
                {selected.isRide ? (
                  <Image
                    source={{ uri: "https://links.papareact.com/3pn" }}
                    style={styles.image2}
                  />
                ) : (
                  <Image
                    source={{ uri: "https://links.papareact.com/28w" }}
                    style={styles.image2}
                  />
                )}
                <Text style={tw`text-xl mt-2`}>
                  {selected.isRide ? "Ride Order" : "Delivery Order"}
                </Text>
              </View>
              <View
                style={tw`flex flex-row justify-around bg-gray-200 mb-2 rounded-lg`}
              >
                <View style={tw`flex justify-center items-center py-2`}>
                  <Text>Distance</Text>
                  <Text style={tw`text-lg font-bold`}>{selected.distance}</Text>
                </View>
                <View style={tw`flex justify-center items-center py-2`}>
                  <Text>Price</Text>
                  <Text style={tw`text-lg font-bold`}>${selected.price}</Text>
                </View>
                <View style={tw`flex justify-center items-center py-2`}>
                  <Text>Duration</Text>
                  <Text style={tw`text-lg font-bold`}>
                    {selected.travelTime}
                  </Text>
                </View>
              </View>
              <Text style={tw`text-xs font-bold`}>From: </Text>
              <View style={tw`p-4 bg-gray-200 mb-2 rounded-lg`}>
                <Text style={styles.contactNumber}>
                  {selected.origin.description}
                </Text>
              </View>
              <Text style={tw`text-xs font-bold`}>To: </Text>
              <View style={tw`p-4 bg-gray-200 mb-2 rounded-lg`}>
                <Text style={styles.contactNumber}>
                  {selected.destination.description}
                </Text>
              </View>
              {selected.userDriver.length === 0 ? (
                <View
                  style={[
                    tw`py-3 mb-2 rounded-lg ${!selected && "bg-gray-300"}`,
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
                  <Text style={tw`text-xs font-bold`}>Driver info: </Text>
                  <View style={tw`flex-row justify-center items center`}>
                    <TouchableOpacity
                      onPress={() => setIsVisible(true)}
                      style={tw`ìtems-center`}
                    >
                      <Image
                        source={{ uri: driverData?.avatar }}
                        style={[
                          styles.imgStyle1,
                          tw`bg-gray-200 mb-2 rounded-lg`,
                        ]}
                        resizeMode="cover"
                      />
                      <Text style={tw`text-center text-xs mb-2`}>Avatar</Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={tw`flex-row justify-between items center px-2 mb-2`}
                  >
                    <TouchableOpacity
                      onPress={() => setIsVisible(true)}
                      style={tw`ìtems-center`}
                    >
                      <Image
                        source={{ uri: driverData?.carLicensePlate }}
                        style={[
                          styles.imgStyle2,
                          tw`bg-gray-200 mb-2 rounded-lg`,
                        ]}
                        resizeMode="cover"
                      />
                      <Text style={tw`text-center text-xs mb-2`}>
                        Car license plate
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setIsVisible(true)}
                      style={tw`ìtems-center`}
                    >
                      <Image
                        source={{ uri: driverData?.driverLicense }}
                        style={[
                          styles.imgStyle2,
                          tw`bg-gray-200 mb-2 rounded-lg`,
                        ]}
                        resizeMode="cover"
                      />
                      <Text style={tw`text-center text-xs mb-2`}>
                        Driver license
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setIsVisible(true)}
                      style={tw`ìtems-center`}
                    >
                      <Image
                        source={{ uri: driverData?.driverPhoto }}
                        style={[
                          styles.imgStyle2,
                          tw`bg-gray-200 mb-2 rounded-lg`,
                        ]}
                        resizeMode="cover"
                      />
                      <Text style={tw`text-center text-xs mb-2`}>
                        Driver photo
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {selected?.tripProgress?.length !== 0 && (
                <>
                  <Text style={tw`text-xs font-bold`}>Trip Progress: </Text>
                  <TouchableOpacity
                    onPress={() => handletripProgress(selected.tripProgress)}
                    style={tw`p-4 bg-gray-200 mb-2 rounded-lg`}
                  >
                    <Text style={[styles.contactNumber, tw`text-center`]}>
                      Shared trip progress availble.Press here
                    </Text>
                  </TouchableOpacity>
                </>
              )}
              {!selected?.isRide && (
                <>
                  <Text style={tw`text-xs font-bold`}>
                    Delivery Confirmation:
                  </Text>
                  <TouchableOpacity
                    onPress={() => setIsVisible(true)}
                    style={tw`relative p-0 bg-gray-200 mb-2 rounded-lg h-40 justify-center items-center`}
                  >
                    {selected?.confirmPhoto?.length > 0 ? (
                      <Image
                        source={{
                          uri: selected?.confirmPhoto,
                        }}
                        style={tw`w-full h-40 rounded-lg`}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={tw`justify-center items-center`}>
                        <Text style={tw`text-center text-xs font-bold`}>
                          Confirm Delivery not here yet
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity
                style={[
                  tw`py-3 mb-2 rounded-lg ${!selected && "bg-gray-300"}`,
                  {
                    backgroundColor:
                      selected?.status === "open" ? "#84CC16" : "#DC2626",
                  },
                ]}
              >
                <Text style={tw`text-center text-white text-base`}>
                  Confirm
                </Text>
              </TouchableOpacity>
              {selected?.status === "open" && (
                <TouchableOpacity
                  onPress={handleCloseOrder}
                  style={[
                    tw`py-3 rounded-lg mb-6 ${!selected && "bg-gray-300"}`,
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
      <ImageView
        images={images}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
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
      <View style={tw`p-5 py-0`}>
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
              <View
                style={tw`flex flex-row justify-between items-center mb-4 px-4`}
              >
                <View>
                  {item.isRide ? (
                    <Image
                      source={{ uri: "https://links.papareact.com/3pn" }}
                      style={styles.image}
                    />
                  ) : (
                    <Image
                      source={{ uri: "https://links.papareact.com/28w" }}
                      style={styles.image}
                    />
                  )}
                </View>
                {item.createdAt && (
                  <Text style={tw`text-gray-600 text-xs text-right pr-2`}>
                    {moment(item.createdAt.toDate(), "YYYYMMDD").fromNow()}
                  </Text>
                )}
              </View>
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
                    {/* <Text style={tw`text-xs w-10`}>From</Text> */}
                    <Text style={tw`text-xs font-bold`}>
                      {item.origin.description.length > 35
                        ? item.origin.description.substr(0, 35) + "..."
                        : item.origin.description}
                    </Text>
                  </View>
                  <View></View>
                  <View style={tw`flex flex-row`}>
                    {/* <Text style={tw`text-xs w-10`}>To</Text> */}
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
  avatar: {
    position: "absolute",
    top: "-12.5%",
    left: "44%",
    width: Dimensions.get("window").width / 4,
    height: Dimensions.get("window").width / 4,
    borderRadius: 50,
  },
  imgStyle1: {
    width: 60,
    height: 60,
  },
  imgStyle2: {
    width: 80,
    height: 80,
  },
  icon: {
    width: 20,
    height: 20,
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  image2: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
});
