import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAP_APIKEY } from "@env";
import { Icon } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { setDestination, setOrigin } from "../../redux/Data/data.actions";

const mapState = ({ data }) => ({
  kind: data.kind,
});

const ReadyScreen = ({ navigation }) => {
  const { kind } = useSelector(mapState);
  const dispatch = useDispatch();
  const [status, setStatus] = useState(false);
  useEffect(() => {
    console.log("Kind  => ", kind);
  }, [kind]);

  const handleNext = () => {
    console.log("Send ");
    navigation.navigate("MapScreen");
  };

  return (
    <View style={tw`m-4`}>
      {kind ? (
        <>
          <Text style={tw`text-base`}>Please fill the location:</Text>
          {kind === "0" ? (
            <View style={tw`rounded-lg mt-4 mb-2`}>
              <GooglePlacesAutocomplete
                placeholder="Where are you now?"
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
                  setStatus(true);
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
                    fontSize: 16,
                  },
                }}
                enablePoweredByContainer={false}
              />
            </View>
          ) : (
            <View style={tw`rounded-lg mt-4 mb-2`}>
              <GooglePlacesAutocomplete
                placeholder="From where you want your delivery?"
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
                  setStatus(true);
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
                    fontSize: 16,
                  },
                }}
                enablePoweredByContainer={false}
              />
            </View>
          )}
          <TouchableOpacity
            style={tw`flex-row justify-center items-center p-4 bg-gray-200 rounded-lg`}
            onPress={handleNext}
            disabled={!status}
          >
            <Text style={[tw`text-lg text-center`, { color: "#000" }]}>
              Next
            </Text>
            <Icon
              type="antdesign"
              name="arrowright"
              color="black"
              size={18}
              style={tw`pl-2`}
            />
          </TouchableOpacity>
        </>
      ) : (
        <View style={tw`flex flex-1 justify-center items-center`}>
          <Text style={tw`text-xl`}>Please Wait ...</Text>
        </View>
      )}
    </View>
  );
};

export default ReadyScreen;

const styles = StyleSheet.create({});
