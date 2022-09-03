import {Colors} from "../styles/Variables";
import NumericInput from "react-native-numeric-input";
import {Component} from "react";
import {WidgetStyles} from "../styles/WidgetStyles";
import FixedCounter from "../extensions/Counter";


export default class NumberSelect extends Component {

    renderCounter() {
        return (
            <FixedCounter
                start={this.props.initial ?? 0}
                onChange={this.props.onChange ?? null}
                min={this.props.min ?? -999999}
                max={this.props.max ??  999999}
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
                onChange={this.props.onChange}
                leftButtonBackgroundColor={Colors.primaryLight}
                rightButtonBackgroundColor={Colors.primaryLight}
                rounded={false}
                containerStyle={{borderRadius: 5, overflow: 'hidden', height: 40}}
                borderColor={Colors.transparent}
                minValue={this.props.min}
                maxValue={this.props.max}
                initValue={this.props.initial}
                textColor={Colors.text}
                customDecIcon={"-"}
            />
        );
    }

    render() {
        return (this.props.useOld ?? false) ? this.renderNumericInput() : this.renderCounter();
    }

}