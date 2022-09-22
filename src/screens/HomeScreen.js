import { StatusBar } from 'expo-status-bar';
import {Pressable, Text, View} from 'react-native';
import Screen from "../abstract/Screen";
import {ScreenStyles} from "../styles/ScreenStyles";
import {Colors} from "../styles/Variables";
import WorkloadWidget, {unitNames} from "../components/WorkloadWidget";
import {ButtonStyles} from "../styles/ButtonStyles";
import {TextStyles} from "../styles/TextStyles";
import EventSystem from "../services/EventSystem";
import ConfigService, {configEvents} from "../services/ConfigService";

export default class HomeScreen extends Screen {

    constructor(props) {
        super(props);

        this.configService = ConfigService.getInstance();
        EventSystem.subscribe(configEvents.configChanged, this.onConfigChange, this);
        this.onConfigChange();
        this.setState({
            isDebugMode: false,
            debugCounter: 4 // fifth tap will activate debug mode
        });
    }

    onConfigChange() {
        let timeUnit = this.configService.get('timeUnit');
        let trackingState = this.configService.get('trackingState');

        this.setState({
            unit: timeUnit,
            unitsSinceBegin: WorkloadWidget.getUnitsSinceBegin(timeUnit),
            trackingState: trackingState
        });
    }

    onTrackingButtonPressed() {
        if(this.state.trackingState) {
            // there is already a tracking ongoing
            this.configService.set('trackingState', null);
        }
        else {
            // there is currently no tracking -> create a new one
            let now = new Date();
            this.configService.set('trackingState', {
                startedAt: now.getTime(),
                pausedAt: null, // if and when the user paused the tracking
                totalPauseTime: 0 // paused time from previous tracking
            });
        }
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
                        onPress={() => this.navigation.navigate('Tracking')}
                        style={ButtonStyles.primary}
                    >
                        <Text style={[TextStyles.dark, {width: 150, textAlign: 'center'}]}>Tracking</Text>
                    </Pressable>

                    <View style={TextStyles.spacer.m} />
                    <View style={TextStyles.spacer.xs} />

                    <Pressable
                        onPress={() => this.navigation.navigate('Config', {debugMode: this.state.debugMode})}
                        style={ButtonStyles.secondary}
                    >
                        <Text style={[TextStyles.default, {width: 150, textAlign: 'center'}]}>Konfiguration</Text>
                    </Pressable>

                    <View style={TextStyles.spacer.m} />
                    <View style={TextStyles.spacer.xs} />

                    <Pressable
                        onPress={() => this.navigation.navigate('TimeListing')}
                        style={ButtonStyles.secondary}
                    >
                        <Text style={[TextStyles.default, {width: 150, textAlign: 'center'}]}>Protokoll</Text>
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
                        ><Text style={TextStyles.camouflage}>Prototime v0.6.0 </Text></Pressable>
                        <Text style={TextStyles.camouflage}>&copy; 2022 Fabian Holzwarth</Text>
                    </View>
                </View>

            </View>
        );
    };
}