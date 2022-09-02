import { StyleSheet, Text, View } from 'react-native';
import {Component} from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import {NavigationContainer} from "@react-navigation/native";
import TimeListingScreen from "./src/screens/TimeListingScreen";
import AddTimeScreen from "./src/screens/AddTimeScreen";

const Stack = createNativeStackNavigator();

export default class App extends Component {


  render() {
    return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="TimeListing" component={TimeListingScreen} />
            <Stack.Screen name="AddTime" component={AddTimeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
