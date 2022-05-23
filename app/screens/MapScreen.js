import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import tailwind from "tailwind-react-native-classnames";
import tw from "tailwind-react-native-classnames";
import Map from "../components/Map";
import NavFavourites from "../components/NavFavourites";
import MapNavigator from "../navigation/MapNavigator";

const mapState = ({ data }) => ({
  origin: data.origin,
});

const MapScreen = ({ navigation }) => {
  const { origin } = useSelector(mapState);

  useEffect(() => {
    if (!origin) navigation.replace("Home");
  }, []);

  return (
    <View style={tw`bg-white h-full`}>
      <View style={tailwind`h-1/2`}>
        <Map />
      </View>
      <View style={tailwind`h-1/2`}>
        <MapNavigator />
      </View>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({});
