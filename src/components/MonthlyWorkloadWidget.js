import {Pressable, Text, View} from "react-native";
import ProtocolService, {protocolEvents} from "../services/ProtocolService";
import CircularProgress from "react-native-circular-progress-indicator";
import {Colors} from "../styles/Variables";
import {TextStyles} from "../styles/TextStyles";
import {ButtonStyles} from "../styles/ButtonStyles";
import EventSystem from "../services/EventSystem";
import ConfigService, {configEvents} from "../services/ConfigService";
import {defaultConfig} from "../screens/ConfigScreen";
import {TimelessStateComponent} from "../abstract/Component";
import TimeCalculations from "../services/TimeCalculations";

export default class MonthlyWorkloadWidget extends TimelessStateComponent {

    constructor(props) {
        super(props);

        this.state = {
            // the total worked time
            totalTime: 0,
            // the total worked time of this month
            monthlyTime: 0,
            // number of months since start of measurement
            monthsSinceBegin: 0,
            // number of hours, that should be worked each month
            monthlyExpenseHours: 0
        }

        this.navigation = props.navigation;

        EventSystem.subscribe(configEvents.configChanged, this.onConfigChanged, this);
        EventSystem.subscribe(protocolEvents.protocolChanged, this.onProtocolChanged, this);
        this.onConfigChanged();
        this.onProtocolChanged();
    }

    onConfigChanged() {
        this.setState({
            monthsSinceBegin:   MonthlyWorkloadWidget.getMonthsSinceBegin(),
            monthlyExpenseHours: ConfigService.getInstance().get('hoursPerTimeUnit', defaultConfig.hoursPerUnit)
        });
    }

    onProtocolChanged() {
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
        let totalWorkedMinutes = this.state.totalTime / (1000 * 60);
        let monthlyWorkedMinutes = this.state.monthlyTime / (1000 * 60);

        // time in minutes, that has to be worked until now
        let totalWorkload = (this.state.monthsSinceBegin * this.state.monthlyExpenseHours * 60);
        // time in minutes, that have to be worked to fulfill the requirements
        let totalUnfulfilledWorkload = totalWorkload - totalWorkedMinutes;


        let monthlyWorkload = (this.state.monthlyExpenseHours * 60);
        let monthlyUnfulfilledWorkload = monthlyWorkload - monthlyWorkedMinutes;

        // true, if there is more work to be done, than planed for one month
        let isBacklogOutOfControl = totalUnfulfilledWorkload > monthlyWorkload;

        return (
            <View style={{ flex: 1 }}>

                <View style={{flex: 5, flexDirection: 'row', width: '100%'}}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={TextStyles.default}>Status</Text>
                        <View style={TextStyles.spacer.l} />
                        <CircularProgress
                            value={-totalUnfulfilledWorkload}
                            initialValue={'0'}
                            maxValue={Math.max(totalUnfulfilledWorkload, monthlyWorkload)}
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
                        <Text style={TextStyles.default}>Monats-Pensum</Text>
                        <View style={TextStyles.spacer.l} />
                        <CircularProgress
                            value={monthlyWorkedMinutes}
                            initialValue={'0'}
                            maxValue={Math.max(monthlyWorkload, monthlyWorkedMinutes)}
                            radius={80}
                            duration={500+Math.random()*500}
                            progressValueColor={Colors.primaryLight}
                            activeStrokeColor={Colors.primaryLight}
                            title={'/ '+TimeCalculations.formatMinutes(monthlyWorkload)}
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

    static getMonthsSinceBegin() {
        let measurementBeginning = new Date(ConfigService.getInstance().get('startOfMeasurementMs', defaultConfig.startOfMeasurement));
        return TimeCalculations.timeDiffInMonths(measurementBeginning, new Date())+1;
    }



}