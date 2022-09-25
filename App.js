import { StyleSheet, Text, View } from 'react-native';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import {NavigationContainer} from "@react-navigation/native";
import TimeListingScreen from "./src/screens/TimeListingScreen";
import AddTimeScreen from "./src/screens/AddTimeScreen";
import ConfigScreen from "./src/screens/ConfigScreen";
import {Colors} from "./src/styles/Variables";
import ConfigService, {configEvents} from "./src/services/ConfigService";
import ProtocolService, {protocolEvents} from "./src/services/ProtocolService";
import EventSystem from "./src/services/EventSystem";
import {TimelessStateComponent} from "./src/abstract/Component";
import LoadingWidget from "./src/components/LoadingWidget";
import ImageService from "./src/services/ImageService";
import EditTimeScreen from "./src/screens/EditTimeScreen";
import TrackingScreen from "./src/screens/TrackingScreen";
import MessageScreen from "./src/screens/MessageScreen";
import DebugScreen from "./src/screens/DebugScreen";

const Stack = createNativeStackNavigator();

export default class App extends TimelessStateComponent {

    constructor(props) {
        super(props);
        this.setState({
            isConfigInitialized: false,
            isProtocolInitialized: false
        });

        EventSystem.subscribe(configEvents.configInitialized, this.onConfigInitialized, this);
        EventSystem.subscribe(protocolEvents.protocolInitialized, this.onProtocolInitialized, this);

        ConfigService.getInstance();
        ProtocolService.getInstance();
        ImageService.getInstance();
    }

    onConfigInitialized() {
        this.setState({
            isConfigInitialized: true,
        });
    }

    onProtocolInitialized() {
        this.setState({
            isProtocolInitialized: true,
        });
    }

    render() {
        if(!this.state.isProtocolInitialized && ProtocolService.getInstance().isReady()) {
            this.onProtocolInitialized();
        }
        if(!this.state.isConfigInitialized && ConfigService.getInstance().isReady()) {
            this.onConfigInitialized();
        }

        return (
            <View style={{ flex: 1, backgroundColor: Colors.background }}>
                {
                    (!this.state.isProtocolInitialized || !this.state.isConfigInitialized) ?
                        this.renderLoadingScreen() :
                        this.renderApp()
                }
            </View>
        );
    }

    renderLoadingScreen() {
        let hint = '';
        if(this.state.isProtocolInitialized)    hint += 'Protocol loaded \n';
        if(this.state.isConfigInitialized)      hint += 'Configuration loaded \n';

        return (
            <LoadingWidget
                hint={hint}
            />
        );
    }

    renderApp() {
        return (
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
                        name="EditTime"
                        component={EditTimeScreen}
                        options={{
                            title: "Ändern"
                        }}
                    />
                    <Stack.Screen
                        name="Config"
                        component={ConfigScreen}
                        options={{
                            title: "Einstellungen"
                        }}
                    />
                    <Stack.Screen
                        name="Tracking"
                        component={TrackingScreen}
                        options={{
                            title: "Tracking"
                        }}
                    />
                    <Stack.Screen
                        name="Message"
                        component={MessageScreen}
                        options={{
                            title: "Messageboard"
                        }}
                    />
                    <Stack.Screen
                        name="Debug"
                        component={DebugScreen}
                        options={{
                            title: "Debug"
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
