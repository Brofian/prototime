import {Component} from "react";
import {DateTimePickerAndroid} from "@react-native-community/datetimepicker";
import {Button, Text, TouchableHighlight, TouchableOpacity, View} from "react-native";
import {WidgetStyles} from "../styles/WidgetStyles";
import {Colors} from "../styles/Variables";

const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const weekdays = ['So','Mo','Di','Mi','Do','Fr','Sa'];

export default class DateTimeWidget extends Component {

    state = {
        value: 0
    }

    constructor(props) {
        super(props);
        this.onChange = props.onChange;
        this.getMinDateFunc = props.minDateFunc;
        this.hideDate = props.hideDate ?? false;
        this.hideTime = (props.hideTime ?? false) && !this.hideDate;
        this.state.value = props.value;
    }


    static lastValue = null;
    static getDerivedStateFromProps(nextProps) {
        if(nextProps.value === DateTimeWidget.lastValue) {
            return {};
        }

        return { value: nextProps.value }
    }

    showDateTimePicker(mode) {
        let minimumDate = this.getMinDateFunc ? this.getMinDateFunc() : 0;
        DateTimePickerAndroid.open({
            value: new Date(this.state.value),
            onChange: this.onDateTimePickerChanged.bind(this, mode),
            mode: mode,
            minimumDate: new Date(minimumDate),
            is24Hour: true,
        });
    }

    onAfterStateChanged() {
        this.onChange(this.state.value);
    }

    onDateTimePickerChanged(mode, event) {
        if(event.type === 'set') {
            let configuration = new Date(event.nativeEvent.timestamp);
            let current;

            if(this.hideTime || this.hideDate) {
                current = new Date(0);
                current.setHours(5);
            }
            else {
                current = new Date(this.state.value);
            }

            if(mode === 'date') {
                current.setDate(configuration.getDate());
                current.setMonth(configuration.getMonth());
                current.setFullYear(configuration.getFullYear());
            }
            else if(mode === 'time') {
                current.setMinutes(configuration.getMinutes());
                current.setHours(configuration.getHours());
            }

            DateTimeWidget.lastValue = this.state.value;
            this.setState({
                value: current.getTime()
            }, this.onAfterStateChanged.bind(this));
        }
    }

    /**
     * @param {int} num
     * @return {int}
     */
    static toTwoDigit(num) {
        return (num > 9) ? num : '0'+num;
    }

    /**
     * @param {Date} datetime
     * @returns {string}
     */
    static toCalendarDate(datetime) {
        let weekday = weekdays[datetime.getDay()];
        let date = DateTimeWidget.toTwoDigit(datetime.getDate());
        let month = DateTimeWidget.toTwoDigit(datetime.getMonth()+1);
        let year = datetime.getFullYear();
        return `${weekday} ${date}.${month}.${year}`;
        //return datetime.toLocaleDateString('de-DE', dateOptions);
    }

    /**
     * @param {Date} datetime
     * @param {Boolean} asUtc
     * @returns {string}
     */
    static toTime(datetime, asUtc = false) {
        let hour = DateTimeWidget.toTwoDigit(asUtc ? datetime.getUTCHours() : datetime.getHours());
        let minute = DateTimeWidget.toTwoDigit(asUtc ? datetime.getUTCMinutes() : datetime.getMinutes());
        return `${hour}:${minute}`;
        //return datetime.toLocaleTimeString('de-DE', dateOptions);
    }

    /**
     * @param datetime
     */
    static toFullDateTime(datetime) {
       return `${DateTimeWidget.toCalendarDate(datetime)} ${DateTimeWidget.toTime(datetime)} Uhr`;
    }

    render() {
        return (
            <View style={WidgetStyles.dateTime.main}>

                {
                    this.hideDate ? '' :
                        <TouchableOpacity
                            onPress={() => this.showDateTimePicker('date')}
                            style={WidgetStyles.dateTime.left}
                            activeOpacity={0.8}
                        >
                            <Text>{DateTimeWidget.toCalendarDate(new Date(this.state.value))}</Text>
                        </TouchableOpacity>
                }


                {
                    this.hideTime ? '' :
                        <TouchableOpacity
                            onPress={() => this.showDateTimePicker('time')}
                            style={WidgetStyles.dateTime.right}
                            activeOpacity={0.8}
                        >
                            <Text>{DateTimeWidget.toTime(new Date(this.state.value))} Uhr</Text>
                        </TouchableOpacity>
                }

            </View>
        );
    }

}