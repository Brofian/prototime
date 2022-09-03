import {Component} from "react";
import {Pressable, Text, View} from "react-native";
import ProtocolService from "../services/ProtocolService";
import CircularProgress from "react-native-circular-progress-indicator";
import {Colors} from "../styles/Variables";
import {TextStyles} from "../styles/TextStyles";
import {ButtonStyles} from "../styles/ButtonStyles";
import EventSystem from "../services/EventSystem";
import ConfigService from "../services/ConfigService";
import {defaultConfig} from "../screens/ConfigScreen";

export default class MonthlyWorkloadWidget extends Component {

    state = {
        workload: 0, // the open time (months since start * monthlyExpense - total worked time)
        workloadMonth: 0, // the open time (monthlyExpense - monthly worked time)
        totalTime: 0, // the total worked time
        monthlyTime: 0, // the total worked time of this month
        measurementBeginning: new Date(defaultConfig.startOfMeasurement),
        monthsSinceBegin: 0
    }

    constructor(props) {
        super(props);
        this.montlyExpenseHours = 27; // 27 hours in milliseconds
        this.state.measurementBeginning = new Date(ConfigService.getInstance().get('startOfMeasurementMs', defaultConfig.startOfMeasurement));
        this.state.monthsSinceBegin = this.monthDiff(this.state.measurementBeginning, new Date())+1;
        this.navigation = props.navigation;

        EventSystem.subscribe('initialized', this.onProtocolInitialized, this);
        EventSystem.subscribe('configLoaded', this.onConfigChanged, this);
        EventSystem.subscribe('configChanged', this.onConfigChanged, this);
    }

    onConfigChanged() {
        let measurementBeginning = new Date(ConfigService.getInstance().get('startOfMeasurementMs', defaultConfig.startOfMeasurement));
        let monthSinceBegin = this.monthDiff(measurementBeginning, new Date())+1;

        this.setState({
            measurementBeginning: measurementBeginning,
            monthsSinceBegin: monthSinceBegin
        });
    }

    componentDidMount() {
        this.onProtocolInitialized();
    }

    onProtocolInitialized() {
        let now = new Date();

        let entries = ProtocolService.getInstance().getEntries();
        let totalTime = 0;
        let monthlyTime = 0;

        for(let item of entries) {
            totalTime += item.duration;

            let day = new Date(item.start);
            if(day.getUTCMonth() === now.getUTCMonth() && day.getUTCFullYear() === now.getUTCFullYear()) {
                monthlyTime += item.duration;
            }
        }

        this.setState({
            totalTime: totalTime,
            monthlyTime: monthlyTime
        });
    }


    render() {
        let totalWorkMinutes = this.state.totalTime / (1000 * 60);
        let monthlyWorkMinutes = this.state.monthlyTime / (1000 * 60);
        let totalWorktime = (this.state.monthsSinceBegin * this.montlyExpenseHours * 60);
        let totalWorkload = totalWorktime - totalWorkMinutes;
        let monthlyWorkload = (this.montlyExpenseHours * 60) - monthlyWorkMinutes;

        // true, if there is more work to be done, than planed for one month
        let isTotalEndangered = totalWorkload > (this.montlyExpenseHours*60);

        return (
            <View>

                <View style={{flex: 5, flexDirection: 'row', width: '100%'}}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={TextStyles.default}>Status</Text>
                        <View style={TextStyles.spacer.l} />
                        <CircularProgress
                            value={-totalWorkload}
                            initialValue={'0'}
                            maxValue={Math.max(totalWorktime, monthlyWorkload)}
                            radius={80}
                            duration={500+Math.random()*500}
                            progressValueColor={isTotalEndangered ? Colors.warning : Colors.primaryLight}
                            activeStrokeColor={isTotalEndangered  ? Colors.warning : Colors.primaryLight}
                            progressFormatter={(value) => {
                                'worklet';

                                return (value > 0 ? '+':'')+MonthlyWorkloadWidget.minToTimer(value);
                            }}
                        />
                    </View>

                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={TextStyles.default}>Monats-Pensum</Text>
                        <View style={TextStyles.spacer.l} />
                        <CircularProgress
                            value={monthlyWorkMinutes}
                            initialValue={'0'}
                            maxValue={Math.max(monthlyWorkload+monthlyWorkMinutes, monthlyWorkMinutes)}
                            radius={80}
                            duration={500+Math.random()*500}
                            progressValueColor={Colors.primaryLight}
                            activeStrokeColor={Colors.primaryLight}
                            title={'/ '+MonthlyWorkloadWidget.minToTimer(monthlyWorkload+monthlyWorkMinutes)}
                            titleColor={Colors.text}
                            titleStyle={{fontSize: 15}}
                            progressFormatter={MonthlyWorkloadWidget.minToTimer}
                        />
                    </View>
                </View>

                <View style={{flex: 1, alignSelf: 'stretch', alignItems: 'center' }}>
                    <Pressable
                        onPress={this.onProtocolInitialized.bind(this)}
                        style={ButtonStyles.primary}
                    >
                        <Text style={TextStyles.dark}>Aktualisieren</Text>
                    </Pressable>
                </View>
                <View style={{flex: 7, alignSelf: 'stretch', alignItems: 'center' }}>
                    <Pressable
                        onPress={() => this.navigation.navigate('Config')}
                        style={ButtonStyles.secondary}
                    >
                        <Text style={TextStyles.default}>Konfiguration</Text>
                    </Pressable>
                </View>

                <View style={{flex: 1}}>
                    <Text style={TextStyles.default}>{this.state.monthsSinceBegin} Monat{this.state.monthsSinceBegin===1?'':'e'} seit Beginn</Text>
                    <Text style={TextStyles.camouflage}>Prototime v0.2.5 (c) Fabian Holzwarth</Text>
                </View>

            </View>
        );
    }

    static minToTimer(min) {
        'worklet';

        let hours = Math.abs(Math.floor(min/60));
        if(hours < 10) {
            hours = '0'+hours;
        }

        let minutes = Math.abs(Math.floor(min%60));
        if(minutes < 10) {
            minutes = '0'+minutes;
        }

        return `${min<0?'-':''}${hours}:${minutes}`;
    }

    /**
     * @param {Date} start
     * @param {Date} end
     */
    monthDiff(start, end) {
        let jd = (end.getUTCFullYear() - start.getUTCFullYear());
        let md = end.getUTCMonth() - start.getUTCMonth();
        return jd * 12 + md;
    }




}