import {Pressable, Text, View} from "react-native";
import ProtocolService, {protocolEvents} from "../services/ProtocolService";
import CircularProgress from "react-native-circular-progress-indicator";
import {Colors} from "../styles/Variables";
import {TextStyles} from "../styles/TextStyles";
import {ButtonStyles} from "../styles/ButtonStyles";
import EventSystem from "../services/EventSystem";
import ConfigService, {configEvents} from "../services/ConfigService";
import {defaultConfig} from "../services/ConfigService";
import {TimelessStateComponent} from "../abstract/Component";
import TimeCalculations from "../services/TimeCalculations";


export const unitNames = {
    week: { s: 'Woche', p: 'Wochen', prefix: 'Wochen'},
    month: { s: 'Monat', p: 'Monate', prefix: 'Monats'},
    year: { s: 'Jahr', p: 'Jahre', prefix: 'Jahres'},
};

export default class WorkloadWidget extends TimelessStateComponent {

    constructor(props) {
        super(props);

        this.state = {
            // the total worked time
            totalTime: 0,
            // number of units since start of measurement
            unitsSinceBegin: 0,
            // number of hours, that should be worked each unit
            unitExpenseHours: 0,
            // the unit, in which time measurements will be displayed
            timeUnit: defaultConfig.timeUnit,
            // the total worked time of each unit
            bookedUnitTime: {
                week: 0,
                month: 0,
                year: 0
            },
            // number of hours, after which the color of the total time changes to red
            backlogThreshold: defaultConfig.backlogThreshold,
            ignoredHoursInUnitBeforeStart: defaultConfig.ignoredHoursInUnitBeforeStart
        }

        this.navigation = props.navigation;

        EventSystem.subscribe(configEvents.configChanged, this.onConfigChanged, this);
        EventSystem.subscribe(protocolEvents.protocolChanged, this.onProtocolChanged, this);
        this.onConfigChanged();
        this.onProtocolChanged();
    }

    onConfigChanged() {
        let config = ConfigService.getInstance();
        let timeUnit = config.get('timeUnit', defaultConfig.timeUnit);
        this.setState({
            unitsSinceBegin:   WorkloadWidget.getUnitsSinceBegin(timeUnit),
            unitExpenseHours: config.get('hoursPerTimeUnit', defaultConfig.hoursPerUnit),
            backlogThreshold: config.get('backlogThreshold', defaultConfig.backlogThreshold),
            ignoredHoursInUnitBeforeStart: config.get('ignoredHoursInUnitBeforeStart', defaultConfig.ignoredHoursInUnitBeforeStart),
            timeUnit: timeUnit
        });
    }

    onProtocolChanged() {
        let now = new Date();

        let entries = ProtocolService.getInstance().getEntries();
        let totalTime = 0;
        let monthlyTime = 0;
        let annualTime = 0;
        let weeklyTime = 0;

        for(let item of entries) {
            totalTime += item.duration;

            let day = new Date(item.start);

            if(day.getFullYear() === now.getFullYear()) {
                annualTime += item.duration;

                if(day.getMonth() === now.getMonth()) {
                    monthlyTime += item.duration;
                }
                if(TimeCalculations.getWeek(day) === TimeCalculations.getWeek(now)) {
                    weeklyTime += item.duration;
                }
            }
        }

        this.setState({
            totalTime: totalTime,
            bookedUnitTime: {
                week: weeklyTime,
                month: monthlyTime,
                year: annualTime
            }
        });
    }

    render() {
        let totalWorkedMinutes = this.state.totalTime / (1000 * 60) + (this.state.ignoredHoursInUnitBeforeStart*60);
        let unitWorkedMinutes = this.state.bookedUnitTime[this.state.timeUnit] / (1000 * 60);

        // time in minutes, that has to be worked until now
        let totalWorkload = (this.state.unitsSinceBegin * this.state.unitExpenseHours * 60);
        // time in minutes, that have to be worked to fulfill the requirements
        let totalUnfulfilledWorkload = totalWorkload - totalWorkedMinutes;


        let unitWorkload = (this.state.unitExpenseHours * 60);
        let unitUnfulfilledWorkload = unitWorkload - unitWorkedMinutes;

        // true, if there is more work to be done, than configured as backlogThreshold
        let isBacklogOutOfControl = totalUnfulfilledWorkload > (this.state.backlogThreshold*60);

        return (
            <View style={{ flex: 1 }}>

                <View style={{flex: 5, flexDirection: 'row', width: '100%'}}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={TextStyles.default}>Status</Text>
                        <View style={TextStyles.spacer.l} />
                        <CircularProgress
                            value={-totalUnfulfilledWorkload}
                            initialValue={'0'}
                            maxValue={Math.max(totalUnfulfilledWorkload, unitWorkload)}
                            radius={80}
                            duration={500+Math.random()*500}
                            progressValueColor={isBacklogOutOfControl ? Colors.warning : Colors.primaryLight}
                            activeStrokeColor={isBacklogOutOfControl  ? Colors.warning : Colors.primaryLight}
                            progressFormatter={(value) => {
                                'worklet';

                                return (value > 0 ? '+':'')+TimeCalculations.formatMinutes(value);
                            }}
                        />
                    </View>

                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={TextStyles.default}>{unitNames[this.state.timeUnit].prefix}-Pensum</Text>
                        <View style={TextStyles.spacer.l} />
                        <CircularProgress
                            value={unitWorkedMinutes}
                            initialValue={'0'}
                            maxValue={Math.max(unitWorkload, unitWorkedMinutes)}
                            radius={80}
                            duration={500+Math.random()*500}
                            progressValueColor={Colors.primaryLight}
                            activeStrokeColor={Colors.primaryLight}
                            title={'/ '+TimeCalculations.formatMinutes(unitWorkload)}
                            titleColor={Colors.text}
                            titleStyle={{fontSize: 15}}
                            progressFormatter={TimeCalculations.formatMinutes}
                        />
                    </View>
                </View>

                <View style={{flex: 1, alignSelf: 'stretch', alignItems: 'center' }}>
                    <Pressable
                        onPress={() => {
                            this.onProtocolChanged();
                            this.onConfigChanged();
                        }}
                        style={ButtonStyles.primary}
                    >
                        <Text style={TextStyles.dark}>Aktualisieren</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    static getUnitsSinceBegin(unit) {
        let measurementBeginning = new Date(ConfigService.getInstance().get('startOfMeasurementMs', defaultConfig.startOfMeasurement));

        switch(unit) {
            case 'week':
                return TimeCalculations.timeDiffInWeeks(measurementBeginning, new Date())+1;
            case 'month':
                return TimeCalculations.timeDiffInMonths(measurementBeginning, new Date())+1;
            case 'year':
            default:
                return TimeCalculations.timeDiffInYears(measurementBeginning, new Date())+1;
        }

    }

    static getMonthsSinceBegin() {
        let measurementBeginning = new Date(ConfigService.getInstance().get('startOfMeasurementMs', defaultConfig.startOfMeasurement));
        return TimeCalculations.timeDiffInMonths(measurementBeginning, new Date())+1;
    }


}