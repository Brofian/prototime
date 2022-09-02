import { StatusBar } from 'expo-status-bar';
import Screen from "../abstract/Screen";
import {ScreenStyles} from "../styles/ScreenStyles";
import {Text, View} from "react-native";
import ActionButton from "../components/ActionButton";
import {Colors} from "../styles/Variables";


export default class TimeListingScreen extends Screen {

    render() {
        return (
            <View style={ScreenStyles.container}>
                <Text>Time Listing!</Text>
                <StatusBar style="auto"/>

                <ActionButton
                    src={require('../assets/icons/plus.png')}
                    color={Colors.primary}
                    background={Colors.primaryDark}
                    onPress={() => this.redirect.bind(this, 'AddTime')}
                    size={40}
                />

            </View>
        );
    };
}