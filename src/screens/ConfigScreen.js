import { StatusBar } from 'expo-status-bar';
import {Button, Image, Text, TouchableHighlight, View} from 'react-native';
import Screen from "../abstract/Screen";
import {ScreenStyles} from "../styles/ScreenStyles";

export default class HomeScreen extends Screen {



    render() {
        return (
            <View style={ScreenStyles.container}>
                <StatusBar style="auto"/>

                <Text>Todo: Konfig für wie viele Stunden pro Monat</Text>
                <Text>Todo: Konfig für standard Pausenminuten</Text>
                <Text>Todo: Konfig für start of measurement</Text>
                <Text>Todo: Clear all</Text>

            </View>
        );
    };
}