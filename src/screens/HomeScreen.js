import { StatusBar } from 'expo-status-bar';
import {Button, Image, Pressable, Text, TouchableHighlight, View} from 'react-native';
import Screen from "../abstract/Screen";
import {ScreenStyles} from "../styles/ScreenStyles";
import ActionButton from "../components/ActionButton";
import {Colors} from "../styles/Variables";
import MonthlyWorkloadWidget from "../components/MonthlyWorkloadWidget";
import {ButtonStyles} from "../styles/ButtonStyles";
import {TextStyles} from "../styles/TextStyles";
import EventSystem from "../services/EventSystem";
import {configEvents} from "../services/ConfigService";

export default class HomeScreen extends Screen {

    constructor(props) {
        super(props);

        EventSystem.subscribe(configEvents.configChanged, this.onConfigChange, this);
        this.onConfigChange();
    }

    onConfigChange() {
        this.setState({
            monthsSinceBegin: MonthlyWorkloadWidget.getMonthsSinceBegin()
        });
    }


    render() {
        return (
            <View style={ScreenStyles.container}>
                <StatusBar style="auto"/>

                <View style={{ flex: 4, width: '100%'}}>
                    <MonthlyWorkloadWidget
                        navigation={this.navigation}
                    />
                </View>


                <View style={{flex: 3, alignSelf: 'stretch', alignItems: 'center' }}>
                    <Pressable
                        onPress={() => this.navigation.navigate('Config')}
                        style={ButtonStyles.secondary}
                    >
                        <Text style={TextStyles.default}>Konfiguration</Text>
                    </Pressable>
                </View>

                <View style={{flex: 2, justifyContent: 'flex-end'}}>
                    <Text style={TextStyles.default}>{this.state.monthsSinceBegin} Monat{this.state.monthsSinceBegin===1?'':'e'} seit Beginn</Text>
                    <Text style={TextStyles.camouflage}>Prototime v0.2.5 (c) Fabian Holzwarth</Text>
                </View>

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