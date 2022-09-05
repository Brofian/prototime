import {Component} from "react";
import {TextStyles} from "../styles/TextStyles";
import {Image, Pressable} from "react-native";
import PropTypes from "prop-types";
import ImageService from "../services/ImageService";

export default class Icon extends Component {

    renderIcon() {
        return (
            <Image
                source={ImageService.getInstance().getIcon('question')}
                style={TextStyles.icon}
                resizeMode='contain'
            />
        );
    }

    renderPressableIcon() {
        return (
            <Pressable
                style={{flex: 1}}
                onPress={this.props.onPress}
            >
                {this.renderIcon()}
            </Pressable>
        );
    }

    render() {
        return this.props.onPress ? this.renderPressableIcon() : this.renderIcon();
    }
}

Icon.propTypes = {
    icon: PropTypes.string.isRequired,
    onPress: PropTypes.func,
};
Icon.defaultProps = {
    icon: null,
    onPress: null
};
