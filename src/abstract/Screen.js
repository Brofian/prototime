import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {TimelessStateComponent} from "./Component";
import {ScreenStyles} from "../styles/ScreenStyles";
import {Colors} from "../styles/Variables";

export default class Screen extends TimelessStateComponent {

    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.route = props.route;
        this.onConstruct();
    }

    onConstruct() {}

    render() {
        return (
            <View>
                <StatusBar backgroundColor={Colors.background} style="light" />

                <Text>TODO: override the render() method!</Text>
            </View>
        );
    };
}