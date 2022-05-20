import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const data = [
  {
    id: "1224",
    title: "Get a ride",
    image: "https://links.papareact.com/3pn",
    screen: "MapScreen",
  },
  {
      id: '4354',
      title: 'My Rides',
      image: 'https://firebasestorage.googleapis.com/v0/b/d2app-74e2c.appspot.com/o/assets%2Frides.PNG?alt=media&token=0e8d2b1e-da95-4bb2-82e9-5bd781bb20b8',
      screen: 'myOrders'
  },
  {
      id: '4356',
      title: 'My Delivery',
      image: 'https://links.papareact.com/28w',
      screen: 'myDelivery'
  },
];
const mapState = ({ data }) => ({
  origin: data.origin,
});
const NavOptions = () => {
  const navigation = useNavigation();
  const origin = useSelector(mapState);

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={tw`p-2 pl-6 pb-8 pt-4 bg-gray-200 mr-4 w-36 rounded-lg`}
          onPress={() => navigation.push(item.screen)}
          disabled={!origin}
        >
          <View style={tw`${!origin && "opacity-30"}`}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={tw`flex-row items-center mt-3`}>
              <Text style={tw`text-base font-bold text-black`}>{item.title}</Text>
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
  );
};

export default NavOptions;

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
});
