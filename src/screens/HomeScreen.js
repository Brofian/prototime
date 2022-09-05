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

export default class HomeScreen extends Screen {

    constructor(props) {
        super(props);

        EventSystem.subscribe(configEvents.configChanged, this.onConfigChange, this);
        this.onConfigChange();
        this.setState({
            isDebugMode: false,
            debugCounter: 4 // fifth tap will activate debug mode
        });
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
                        onPress={() => this.navigation.navigate('Config', {debugMode: this.state.debugMode})}
                        style={ButtonStyles.secondary}
                    >
                        <Text style={TextStyles.default}>Konfiguration</Text>
                    </Pressable>
                </View>

                <View style={{flex: 2, justifyContent: 'flex-end'}}>
                    <Text style={TextStyles.default}>{this.state.unitsSinceBegin} {this.state.unitsSinceBegin===1?  unitNames[this.state.unit].s:unitNames[this.state.unit].p  } seit Beginn</Text>
                    <View style={{flexDirection: 'row'}}>
                        <Pressable
                            onPress={() => {
                                if(this.state.debugCounter <= 0) {
                                    this.setState({
                                        debugMode: true
                                    });
                                }
                                else {
                                    this.setState({
                                        debugCounter: this.state.debugCounter-1
                                    });
                                }
                            }}
                        ><Text style={TextStyles.camouflage}>Prototime v0.4.0 </Text></Pressable>
                        <Text style={TextStyles.camouflage}>&copy; 2022 Fabian Holzwarth</Text>
                    </View>
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