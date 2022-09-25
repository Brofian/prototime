import {Component} from "react";
import {Image, Text, View} from "react-native";
import {TextStyles} from "../styles/TextStyles";
import ImageService from "../services/ImageService";
import PropTypes from "prop-types";
import ModalComponent from "./ModalComponent";

export default class LoadingWidget extends Component {

    render() {
        return (
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Image
                    source={ImageService.getInstance().getImage('logo')}
                    style={{
                        width: '80%',
                        resizeMode: 'contain',
                        height: 300,
                        opacity: 0.2
                    }}
                />
                <Text style={TextStyles.default}>Loading</Text>
                {this.props.hint ? <Text style={[TextStyles.camouflage, TextStyles.centered]}>{this.props.hint}</Text> : ''}
            </View>
        );
    }
}



LoadingWidget.propTypes = {
    hint: PropTypes.string
};
LoadingWidget.defaultProps = {
    hint: null,
};