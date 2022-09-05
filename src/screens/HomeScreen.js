import { StatusBar } from 'expo-status-bar';
import {Button, Image, Pressable, Text, TouchableHighlight, View} from 'react-native';
import Screen from "../abstract/Screen";
import {ScreenStyles} from "../styles/ScreenStyles";
import ActionButton from "../components/ActionButton";
import {Colors} from "../styles/Variables";
import WorkloadWidget, {unitNames} from "../components/WorkloadWidget";
import {ButtonStyles} from "../styles/ButtonStyles";
import {TextStyles} from "../styles/TextStyles";
import EventSystem from "../services/EventSystem";
import ConfigService, {configEvents} from "../services/ConfigService";
import {defaultConfig} from "../services/ConfigService";
import TimeCalculations from "../services/TimeCalculations";

export default class HomeScreen extends Screen {

    constructor(props) {
        super(props);

        EventSystem.subscribe(configEvents.configChanged, this.onConfigChange, this);
        this.onConfigChange();
    }

    onConfigChange() {
        let timeUnit = ConfigService.getInstance().get('timeUnit', defaultConfig.timeUnit);

        this.setState({
            unit: timeUnit,
            unitsSinceBegin: WorkloadWidget.getUnitsSinceBegin(timeUnit)
        });
    }


    render() {
        return (
            <View style={ScreenStyles.container}>
                <StatusBar backgroundColor={Colors.background} style="light" />


                <View style={{ flex: 4, width: '100%'}}>
                    <WorkloadWidget
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
                    <Text style={TextStyles.default}>{this.state.unitsSinceBegin} {this.state.unitsSinceBegin===1?  unitNames[this.state.unit].s:unitNames[this.state.unit].p  } seit Beginn</Text>
                    <Text style={TextStyles.camouflage}>Prototime v0.3.0 &copy; 2022 Fabian Holzwarth</Text>
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