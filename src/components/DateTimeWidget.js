import {Component} from "react";
import {DateTimePickerAndroid} from "@react-native-community/datetimepicker";
import {Button, Text, TouchableHighlight, TouchableOpacity, View} from "react-native";
import {WidgetStyles} from "../styles/WidgetStyles";
import {Colors} from "../styles/Variables";

const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const weekdays = ['So','Mo','Di','Mi','Do','Fr','Sa'];

export default class DateTimeWidget extends Component {

    state = {
        value: new Date()
    }

    constructor(props) {
        super(props);
        this.onChange = props.onChange;
        this.state.value = props.value;
    }

    showDateTimePicker(mode) {
        DateTimePickerAndroid.open({
            value: this.state.value,
            onChange: this.onDateTimePickerChanged.bind(this,  mode),
            mode: mode,
            is24Hour: true,
        });
    }

    onDateTimePickerChanged(mode, event) {
        if(event.nativeEvent.type !== 'dismissed') {
            let configuration = new Date(event.nativeEvent.timestamp);

            if(mode === 'date') {
                this.state.value.setDate(configuration.getDate());
                this.state.value.setMonth(configuration.getMonth());
                this.state.value.setFullYear(configuration.getFullYear());
                this.setState(this.state);
            }

            else if(mode === 'time') {
                this.state.value.setMinutes(configuration.getMinutes());
                this.state.value.setHours(configuration.getHours());
                this.setState(this.state);
            }

            this.onChange(this.state.value);
        }
    }

    /**
     * @param {int} num
     * @return {int}
     */
    toTwoDigit(num) {
        return (num > 9) ? num : '0'+num;
    }

    /**
     * @param {Date} datetime
     * @returns {string}
     */
    toCalendarDate(datetime) {
        let weekday = weekdays[datetime.getDay()];
        let date = this.toTwoDigit(datetime.getDate());
        let month = this.toTwoDigit(datetime.getMonth()+1);
        let year = datetime.getFullYear();
        return `${weekday} ${date}.${month}.${year}`;
        //return datetime.toLocaleDateString('de-DE', dateOptions);
    }

    /**
     * @param {Date} datetime
     * @returns {string}
     */
    toTime(datetime) {
        let hour = this.toTwoDigit(datetime.getHours());
        let minute = this.toTwoDigit(datetime.getMinutes());
        return `${hour}:${minute} Uhr`;
        //return datetime.toLocaleTimeString('de-DE', dateOptions);
    }

    render() {
        return (
            <View style={WidgetStyles.dateTime.main}>

                <TouchableOpacity
                    onPress={() => this.showDateTimePicker('date')}
                    style={WidgetStyles.dateTime.left}
                >
                    <Text>{this.toCalendarDate(this.state.value)}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => this.showDateTimePicker('time')}
                    style={WidgetStyles.dateTime.right}
                >
                    <Text>{this.toTime(this.state.value)}</Text>
                </TouchableOpacity>
            </View>
        );
    }

}