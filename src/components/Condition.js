import {Component} from "react";
import {TextStyles} from "../styles/TextStyles";
import {Image, Pressable, View} from "react-native";
import PropTypes from "prop-types";
import ImageService from "../services/ImageService";

export default class Condition extends Component {

    render() {
        if(this.props.on) {
            return <View style={this.props.style??{}}>{this.props.children}</View>
        }
        else {
            return <View />
        }
    }
}

Condition.propTypes = {
    on: PropTypes.bool.isRequired,
    style: PropTypes.object,
};
Condition.defaultProps = {
    on: false,
    style: {}
};
