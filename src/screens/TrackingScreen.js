import { StatusBar } from 'expo-status-bar';
import {Pressable, Text, View} from 'react-native';
import Screen from "../abstract/Screen";
import {ScreenStyles} from "../styles/ScreenStyles";
import {Colors} from "../styles/Variables";
import {ButtonStyles} from "../styles/ButtonStyles";
import {TextStyles} from "../styles/TextStyles";
import EventSystem from "../services/EventSystem";
import ConfigService, {configEvents} from "../services/ConfigService";
import CircularProgress from "react-native-circular-progress-indicator";
import TimeCalculations from "../services/TimeCalculations";
import AlertHelper from "../services/AlertHelper";

const animationSpeed = 100;

export default class TrackingScreen extends Screen {

    constructor(props) {
        super(props);

        this.configService = ConfigService.getInstance();
        EventSystem.subscribe(configEvents.configChanged, this.onConfigChange, this);
        this.onConfigChange();
        this.setState({
            animationTimer: 0,
            trackedTime: 0
        });


        setInterval(() => {
            if(this.state.trackingState && !this.state.trackingState.pausedAt) {
                this.setState({
                    animationTimer: (this.state.animationTimer + 1) % 100,
                    trackedTime: this.getCurrentTrackingDuration()
                })
            }
        }, animationSpeed);
    }

    onConfigChange() {
        let trackingState = this.configService.get('trackingState');

        this.setState({
            trackingState: trackingState
        });
    }

    onTrackingStart() {
            let now = new Date();
            this.configService.set('trackingState', {
                startedAt: now.getTime(),
                pausedAt: null, // if and when the user paused the tracking
                totalPauseTime: 0 // paused time from previous tracking
            }, true);
    }

    resetTracking() {
        let trackingState = this.configService.get('trackingState');

        if(trackingState.pausedAt) {
            this.onTrackingPauseToggle();
        }

        this.setState({
            animationTimer: 0,
            trackedTime: 0
        });
        this.configService.set('trackingState', null, true);
    }

    onTrackingStop() {
        let trackingState = this.configService.get('trackingState');

        let now = new Date();

        if(trackingState.pausedAt) {
            trackingState.totalPauseTime += now.getTime() - trackingState.pausedAt;
            trackingState.pausedAt = now.getTime();
        }

        let breakTime = Math.floor(trackingState.totalPauseTime/60000);
        this.navigation.navigate('AddTime', {
            item: {
                start: trackingState.startedAt,
                duration: now.getTime() - trackingState.startedAt - trackingState.totalPauseTime,
                breakTime: breakTime,
                comment: "",
            },
            onGoBack: this.resetTracking.bind(this)
        });
    }

    onTrackingPauseToggle() {
        let trackingState = this.configService.get('trackingState');
        let now = new Date();

        if(trackingState.pausedAt) {
            // resume and save paused time
            trackingState.totalPauseTime += now.getTime() - trackingState.pausedAt;
            trackingState.pausedAt = null;
        }
        else {
            // pause
            trackingState.pausedAt = now.getTime();
        }

        this.configService.set('trackingState', trackingState, true);
    }

    getCurrentTrackingDuration() {
        if(!this.state.trackingState) {
            return 0;
        }

        let now = new Date();
        let totalDuration = now.getTime() - this.state.trackingState.startedAt;
        let calculatedDuration = (totalDuration - this.state.trackingState.totalPauseTime) / 1000;
        return Math.floor(calculatedDuration);
    }

    render() {
        return (
            <View style={ScreenStyles.container}>
                <StatusBar backgroundColor={Colors.background} style="light" />

                <View style={{flex: 1, width: '100%', alignItems: 'center'}}>

                    <View style={TextStyles.spacer.m} />
                    <View style={TextStyles.spacer.xs} />

                    <CircularProgress
                        value={this.state.animationTimer}
                        initialValue={'0'}
                        maxValue={50}
                        radius={80}
                        duration={0}
                        progressValueColor={Colors.primaryLight}
                        activeStrokeColor={Colors.primaryLight}
                        activeStrokeSecondaryColor={Colors.secondary}
                        title={TimeCalculations.formatMinutes(this.state.trackedTime/60)}
                        showProgressValue={false}
                        dashedStrokeConfig={{
                            count: 50,
                            width: 3,
                        }}
                    />

                    <View style={TextStyles.spacer.m} />
                    <View style={TextStyles.spacer.xs} />
                </View>

                {
                    (!this.state.trackingState) ?
                        <View style={{flex: 2, alignSelf: 'stretch', alignItems: 'center'}}>

                            <Pressable
                                onPress={this.onTrackingStart.bind(this)}
                                style={ButtonStyles.primary}
                            >
                                <Text style={[TextStyles.dark, {width: 150, textAlign: 'center'}]}>Tracking Starten</Text>
                            </Pressable>

                            <View style={TextStyles.spacer.m} />
                            <View style={TextStyles.spacer.xs} />

                        </View>
                        :
                        <View style={{flex: 2, alignSelf: 'stretch', alignItems: 'center'}}>

                            <Pressable
                                onPress={this.onTrackingStop.bind(this)}
                                style={ButtonStyles.primary}
                            >
                                <Text style={[TextStyles.dark, {width: 150, textAlign: 'center'}]}>Tracking beenden</Text>
                            </Pressable>

                            <View style={TextStyles.spacer.m} />
                            <View style={TextStyles.spacer.xs} />

                            <Pressable
                                onPress={this.onTrackingPauseToggle.bind(this)}
                                style={ButtonStyles.secondary}
                            >
                                <Text style={[TextStyles.default, {width: 150, textAlign: 'center'}]}>
                                    {this.state.trackingState.pausedAt ? 'Tracking fortsetzen' : 'Tracking pausieren'}
                                </Text>
                            </Pressable>

                            <View style={TextStyles.spacer.m} />
                            <View style={TextStyles.spacer.xs} />

                            <Pressable
                                onPress={() => {
                                    AlertHelper.confirm(
                                        'Tracking abbrechen?',
                                        'Wenn du das tust, wird der laufende Tracking Vorgang verworfen. Bist du sicher?',
                                        'Ja, verwerfen!',
                                        this.resetTracking.bind(this, false)
                                    );
                                }}
                                style={ButtonStyles.danger}
                            >
                                <Text style={[TextStyles.default, {width: 150, textAlign: 'center'}]}>
                                    Tracking abbrechen
                                </Text>
                            </Pressable>

                        </View>
                }


            </View>
        );
    };
}