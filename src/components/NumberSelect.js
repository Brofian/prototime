import {Colors} from "../styles/Variables";
import NumericInput from "react-native-numeric-input";
import {Component} from "react";
import Icon from 'react-native-vector-icons/Ionicons'
import {TextStyles} from "../styles/TextStyles";
import Counter from "react-native-counters";
import {WidgetStyles} from "../styles/WidgetStyles";


export default class NumberSelect extends Component {

    constructor(props) {
        super(props);
        this.onChange = props.onChange;
        this.min = props.min ?? null;
        this.max = props.max ?? null;
        this.initial = props.initial ?? 0;
        this.useNumericInput = props.useOld ?? false;
    }


    renderCounter() {
        return (
            <Counter
                start={this.initial}
                onChange={this.onChange}
                min={this.min}
                max={this.max}
                countTextStyle={{
                    color: Colors.text,
                    width: 50,
                    textAlign: 'center'
                }}
                buttonStyle={WidgetStyles.numberSelect.button}
                buttonTextStyle={{
                    color: Colors.background
                }}
            />
        );
    }

    renderNumericInput() {
        return (
            <NumericInput
                onChange={this.onChange}
                leftButtonBackgroundColor={Colors.primaryLight}
                rightButtonBackgroundColor={Colors.primaryLight}
                rounded={false}
                containerStyle={{borderRadius: 5, overflow: 'hidden', height: 40}}
                borderColor={Colors.transparent}
                minValue={0}
                maxValue={600}
                initValue={this.initial}
                textColor={Colors.text}
                customDecIcon={"-"}
            />
        );
    }

    render() {
        return this.useNumericInput ? this.renderNumericInput() : this.renderCounter();
    }

}