import { StyleSheet, Text, View } from 'react-native';
import {Component} from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import {NavigationContainer} from "@react-navigation/native";
import TimeListingScreen from "./src/screens/TimeListingScreen";
import AddTimeScreen from "./src/screens/AddTimeScreen";
import ConfigScreen from "./src/screens/ConfigScreen";

const Stack = createNativeStackNavigator();

export default class App extends Component {


  render() {
    return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  title: ""
                }}
            />
            <Stack.Screen
                name="TimeListing"
                component={TimeListingScreen}
                options={{
                  title: "Protokoll"
                }}
            />
            <Stack.Screen
                name="AddTime"
                component={AddTimeScreen}
                options={{
                  title: "Erstellen"
                }}
            />
            <Stack.Screen
                name="Config"
                component={ConfigScreen}
                options={{
                  title: "Einstellungen"
                }}
            />
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
