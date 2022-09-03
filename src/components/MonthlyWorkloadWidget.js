import {Component} from "react";
import {Pressable, Text, View} from "react-native";
import ProtocolService from "../services/ProtocolService";
import CircularProgress from "react-native-circular-progress-indicator";
import {Colors} from "../styles/Variables";
import {TextStyles} from "../styles/TextStyles";
import {ButtonStyles} from "../styles/ButtonStyles";
import EventSystem from "../services/EventSystem";

export default class MonthlyWorkloadWidget extends Component {

    state = {
        workload: 0, // the open time (months since start * monthlyExpense - total worked time)
        workloadMonth: 0, // the open time (monthlyExpense - monthly worked time)
        totalTime: 0, // the total worked time
        monthlyTime: 0 // the total worked time of this month
    }

    constructor(props) {
        super(props);
        this.montlyExpenseHours = 27; // 27 hours in milliseconds
        this.measurementBeginning = new Date('2022-09-01');
        this.monthsSinceBegin = this.monthDiff(this.measurementBeginning, new Date())+1;
        this.navigation = props.navigation;

        EventSystem.subscribe('initialized', this.onProtocolInitialized, this);
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
        let totalWorkload = (this.monthsSinceBegin * this.montlyExpenseHours * 60) - totalWorkMinutes;
        let monthlyWorkload = (this.montlyExpenseHours * 60) - monthlyWorkMinutes;

        let isTotalEndangered = totalWorkload > (this.montlyExpenseHours*60);

        return (
            <View>

                <View style={{flex: 5, flexDirection: 'row', width: '100%'}}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={TextStyles.default}>Gesamt-Pensum</Text>
                        <View style={TextStyles.spacer.l} />
                        <CircularProgress
                            value={totalWorkMinutes}
                            initialValue={'0'}
                            maxValue={Math.max(totalWorkload+totalWorkMinutes, totalWorkMinutes)}
                            radius={80}
                            duration={500+Math.random()*500}
                            progressValueColor={isTotalEndangered ? Colors.warning : Colors.primaryLight}
                            activeStrokeColor={isTotalEndangered  ? Colors.warning : Colors.primaryLight}
                            title={'/ '+MonthlyWorkloadWidget.minToTimer(totalWorkload+totalWorkMinutes)}
                            titleColor={Colors.text}
                            titleStyle={{fontSize: 15}}
                            progressFormatter={(value) => {
                                'worklet';
                                let h = Math.floor(value/60);
                                h = h>9 ? h: '0'+h;
                                let m = Math.floor(value%60);
                                m = m>9 ? m: '0'+m;
                                return h+':'+m;
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
                            progressFormatter={(value) => {
                                'worklet';
                                let h = Math.floor(value/60);
                                h = h>9 ? h: '0'+h;
                                let m = Math.floor(value%60);
                                m = m>9 ? m: '0'+m;
                                return `${h}:${m}`;
                            }}
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
                    <Text style={TextStyles.default}>{this.monthsSinceBegin} Monat{this.monthsSinceBegin===1?'':'e'} seit Beginn</Text>
                    <Text style={TextStyles.default}>Prototime v0.2.0</Text>
                </View>


            </View>
        );
    }

    static minToTimer(min) {
        let hours = Math.floor(min/60);
        hours = hours>9 ? hours : '0'+hours;
        let minutes = Math.floor(min%60);
        minutes = minutes>9 ? minutes : '0'+minutes;

        return `${hours}:${minutes}`;
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