import { StyleSheet, Text, View } from 'react-native';
import {Component} from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import {NavigationContainer} from "@react-navigation/native";
import TimeListingScreen from "./src/screens/TimeListingScreen";
import AddTimeScreen from "./src/screens/AddTimeScreen";
import ConfigScreen from "./src/screens/ConfigScreen";
import {Colors} from "./src/styles/Variables";
import ConfigService from "./src/services/ConfigService";

const Stack = createNativeStackNavigator();

export default class App extends Component {

    constructor(props) {
        ConfigService.getInstance();
        super(props);
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.background }}>
                <NavigationContainer>
                    <Stack.Navigator
                        initialRouteName="Home"
                        screenOptions={{
                            headerStyle: {
                                backgroundColor: Colors.background, // Specify the height of your custom header
                            },
                            headerTintColor: Colors.text,
                        }}
                    >
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
            </View>
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
