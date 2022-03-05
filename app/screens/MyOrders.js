import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Screen from "../components/Screen";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/utils";

const mapState = ({ user }) => ({
  userD: user.userD,
});

const MyOrders = () => {
  const { userD } = useSelector(mapState);
  const navigation = useNavigation();
  const [orders, setOrders] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "orders"), where("user", "==", userD.id));
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
  }, [orders]);
  const renderModel = () => {
    return (
      <Modal
        isVisible={selected}
        backdropOpacity={0.5}
        // onBackdropPress={() => setModalVisible(false)}
        onBackdropPress={() => setSelected(null)}
        swipeDirection={["up"]}
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
            <ScrollView>
              <View style={tw`flex flex-row justify-around mt-4`}>
                <View
                  style={tw`p-2 pb-6 pt-4 bg-gray-200 mr-4 ml-4 rounded-lg w-24`}
                >
                  <Text>Distance</Text>
                </View>
                <View
                  style={tw`p-2 pb-6 pt-4 bg-gray-200 mr-4 ml-4 rounded-lg w-24`}
                >
                  <Text>Price</Text>
                </View>
              </View>
              <Text style={styles.modelTitle}>Model Title</Text>
              <Text style={styles.contactNumber}>
                {selected.origin.description}
              </Text>
              <Text style={styles.contactNumber}>
                {selected.destination.description}
              </Text>
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
        onPress={() => navigation.push("profile")}
      >
        <Image
          source={{ uri: userD.avatar }}
          style={{ width: 38, height: 38, borderRadius: 20 }}
        />
      </TouchableOpacity>
      <View style={tw`p-5`}>
        <Text style={styles.title2}>Your Orders</Text>
      </View>
      {orders ? (
        <FlatList
          data={orders}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={tw`p-2 pb-6 pt-4 bg-gray-200 mr-4 ml-4 rounded-lg`}
              onPress={() => {
                console.log("Clicked !!");
                setSelected(item);
                // setModalVisible(!isModalVisible);
              }}
            >
              <View style={tw`flex flex-row`}>
                <View>
                  <MaterialCommunityIcons
                    name="ray-start-arrow"
                    size={42}
                    color="black"
                    style={styles.icon1}
                  />
                </View>
                <View>
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

export default MyOrders;

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
    marginBottom: 10,
  },
  avatar: {
    position: "absolute",
    top: "-12.5%",
    left: "45.5%",
    width: "25%",
    height: "25%",
    borderRadius: 50,
  },
});
