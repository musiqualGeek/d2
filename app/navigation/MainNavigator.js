import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
// Auth
import BeforeSplash from "../screens/Auth/BeforeSplash";
import Splash from "../screens/Auth/Splash";
import Login from "../screens/Auth/Login";
import Register from "../screens/Auth/Register";
import Recovery from "../screens/Auth/Recovery";
// Main
import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import EatsScreen from "../screens/EatsScreen";
import { useSelector } from "react-redux";
import RegisterDriver from "../screens/Auth/RegisterDriver";
import LoginDriver from "../screens/Auth/LooginDriver";
import Profile from "../screens/Profile";
import ProfileDriver from "../screens/ProfileDriver";
import MyOrders from "../screens/MyOrders";

const Stack = createStackNavigator();

const mapState = ({ user }) => ({
  currentProperty: user.currentProperty,
  userD: user.userD,
});

const MainNavigator = () => {
  const { currentProperty, userD } = useSelector(mapState);
  return (
    <Stack.Navigator
      initialRouteName="beforeSplash"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Auth */}
      {!currentProperty && (
        <>
          <Stack.Screen name="beforeSplash" component={BeforeSplash} />
          <Stack.Screen name="splash" component={Splash} />
          <Stack.Screen name="recovery" component={Recovery} />
          {/* Passenger */}
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="register" component={Register} />
          {/* Driver */}
          <Stack.Screen name="registerDriver" component={RegisterDriver} />
          <Stack.Screen name="loginDriver" component={LoginDriver} />
        </>
      )}
      {currentProperty && userD?.type == "0" && (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="MapScreen" component={MapScreen} />
          <Stack.Screen name="profile" component={Profile} />
          <Stack.Screen name="myOrders" component={MyOrders} />
        </>
      )}
      {currentProperty && userD?.type == "1" && (
        <>
          <Stack.Screen name="EatsScreen" component={EatsScreen} />
          <Stack.Screen name="profileDriver" component={ProfileDriver} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default MainNavigator;
