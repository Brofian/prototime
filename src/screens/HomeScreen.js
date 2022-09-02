import { StatusBar } from 'expo-status-bar';
import {Button, Image, Text, TouchableHighlight, View} from 'react-native';
import Screen from "../abstract/Screen";
import {ScreenStyles} from "../styles/ScreenStyles";
import ActionButton from "../components/ActionButton";
import {Colors} from "../styles/Variables";
import MonthlyWorkloadWidget from "../components/MonthlyWorkloadWidget";

export default class HomeScreen extends Screen {



    render() {
        return (
            <View style={ScreenStyles.container}>
                <StatusBar style="auto"/>

                <MonthlyWorkloadWidget
                    navigation={this.navigation}
                />

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