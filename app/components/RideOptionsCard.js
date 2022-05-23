import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import tailwind from "tailwind-react-native-classnames";
import { Icon } from "react-native-elements";
import Screen from "./Screen";
import uuid from "react-native-uuid";
import { useSelector } from "react-redux";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/utils";

const data = [
  {
    id: "Uber-X-123",
    title: "Uber X",
    multiplier: 1,
    image: "https://links.papareact.com/3pn",
  },
  {
    id: "Uber-XL-456",
    title: "Uber XL",
    multiplier: 1.2,
    image: "https://links.papareact.com/5w8",
  },
  {
    id: "Uber-LUX-123",
    title: "Uber LUX",
    multiplier: 1.75,
    image: "https://links.papareact.com/7pf",
  },
];

const SEARCH_CHARGE_RATE = 1.5;

const mapState = ({ data, user }) => ({
  origin: data.origin,
  destination: data.destination,
  travelTime: data.travelTime,
  kind: data.kind,
  userD: user.userD,
  userDocId: user.userDocId,
});

const RideOptionsCard = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(null);
  const { origin, destination, travelTime, kind, userD, userDocId } =
    useSelector(mapState);

  useEffect(() => {
    if (!origin || !destination) navigation.push("NavigateCard");
  }, [origin, destination]);

  const travelConst = (item) => {
    return (
      (travelTime?.duration?.value * SEARCH_CHARGE_RATE * item?.multiplier) /
      100
    ).toFixed(2);
  };

  const onChoose = async () => {
    await addDoc(collection(db, "orders"), {
      id: uuid.v4(),
      userPassenger: userDocId,
      userDriver: "",
      destination: destination,
      origin: origin,
      car: selected.title,
      price: travelConst(selected),
      distance: travelTime?.distance?.text,
      travelTime: travelTime?.duration?.text,
      status: "open",
      tripProgress: "",
      createdAt: new Date(),
      closedAt: null,
      isRide: kind === "0" ? true : false,
    });
    Alert.alert(
      "configurations!!!",
      `Car: ${selected.title} \nPrice: $${travelConst(selected)} \nDistence: ${
        travelTime?.distance?.text
      } \n${
        travelTime?.duration.text
      } Travel time\n Please Wait with us until a driver accept it.`,
      [
        {
          text: "OK",
          onPress: () => navigation.navigate("myOrders"),
        },
      ]
    );
  };

  return (
    <Screen style={tailwind`bg-white h-full`}>
      <View style={tailwind`items-center flex-row justify-center mb-3`}>
        <TouchableOpacity
          style={{ left: 10, position: "absolute", zIndex: 100 }}
          onPress={() => navigation.push("NavigateCard")}
        >
          <Icon
            type="antdesign"
            name="arrowleft"
            color="black"
            size={23}
            style={tailwind`p-3`}
          />
        </TouchableOpacity>
        <Text style={tailwind`text-center text-xl font-bold`}>
          Select a ride - {travelTime?.distance?.text}
        </Text>
      </View>
      <View style={tailwind`flex-1 mt-2`}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={tailwind`flex-row items-center justify-between px-5 ${
                selected?.id === item.id && "bg-gray-100"
              }`}
              onPress={() => setSelected(item)}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <View
                style={tailwind`flex-row items-center justify-between flex-1`}
              >
                <View>
                  <Text style={tailwind`text-xl font-bold text-black`}>
                    {item.title}
                  </Text>
                  <Text style={tailwind`text-gray-600`}>
                    {travelTime?.duration?.text} Travel time
                  </Text>
                </View>
                <Text style={tailwind`text-gray-800 text-lg`}>
                  {/* {new Intl.NumberFormat('en-us', {
                                        style: 'currency',
                                        currency: 'USD'
                                    }).format(
                                        travelConst(item)
                                    )} */}
                  ${travelConst(item)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <View>
        <TouchableOpacity
          style={tailwind`bg-black py-3 m-3 rounded-lg ${
            !selected && "bg-gray-300"
          }`}
          disabled={!selected}
          onPress={onChoose}
        >
          <Text style={tailwind`text-center text-white text-xl`}>
            Choose {selected?.title}
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

export default RideOptionsCard;

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
});
