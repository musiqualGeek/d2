import React from "react";
import { store } from "./redux/createStore";
import { Provider } from "react-redux";
import AppNavigator from "./app/navigation/AppNavigator";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  LogBox,
} from "react-native";

LogBox.ignoreAllLogs(); //Ignore all log notifications

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Provider store={store}>
        <StatusBar />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
        >
          <AppNavigator />
        </KeyboardAvoidingView>
      </Provider>
    </SafeAreaView>
  );
}
