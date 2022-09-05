import { StyleSheet, Text, View } from 'react-native';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import {NavigationContainer} from "@react-navigation/native";
import TimeListingScreen from "./src/screens/TimeListingScreen";
import AddTimeScreen from "./src/screens/AddTimeScreen";
import ConfigScreen from "./src/screens/ConfigScreen";
import {Colors} from "./src/styles/Variables";
import ConfigService, {configEvents} from "./src/services/ConfigService";
import ProtocolService, {InitEventName, protocolEvents} from "./src/services/ProtocolService";
import EventSystem from "./src/services/EventSystem";
import {TimelessStateComponent} from "./src/abstract/Component";
import LoadingWidget from "./src/components/LoadingWidget";
import ImageService from "./src/services/ImageService";
import EditTimeScreen from "./src/screens/EditTimeScreen";

const Stack = createNativeStackNavigator();

const forFade = ({ current }) => ({
    cardStyle: {
        opacity: current.progress,
    },
});

export default class App extends TimelessStateComponent {

    constructor(props) {
        super(props);
        this.setState({
            isConfigInitialized: false,
            isProtocolInitialized: false,
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
        return (
            <LoadingWidget />
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
