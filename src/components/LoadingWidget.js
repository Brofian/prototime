import {Component} from "react";
import {Text, View} from "react-native";
import {ScreenStyles} from "../styles/ScreenStyles";
import {TextStyles} from "../styles/TextStyles";

export default class LoadingWidget extends Component {

    render() {
        return (
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Text style={TextStyles.default}>Loading</Text>
            </View>
        );
    }

}