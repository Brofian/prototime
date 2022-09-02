import { StatusBar } from 'expo-status-bar';
import {Button, Image, Text, TouchableHighlight, View} from 'react-native';
import Screen from "../abstract/Screen";
import {ScreenStyles} from "../styles/ScreenStyles";
import ActionButton from "../components/ActionButton";
import {Colors} from "../styles/Variables";

export default class HomeScreen extends Screen {



    render() {
        return (
            <View style={ScreenStyles.container}>
                <Text>Open up App.js to start working on your app!</Text>
                <StatusBar style="auto"/>

                <ActionButton
                    src={require('../assets/icons/list.png')}
                    color={Colors.primary}
                    background={Colors.primaryDark}
                    onPress={() => {
                        this.navigation.navigate('TimeListing')
                    }}
                    size={20}
                />

            </View>
        );
    };
}