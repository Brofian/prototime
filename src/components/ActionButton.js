import {Component} from "react";
import {Image, TouchableHighlight, View} from "react-native";
import {ButtonStyles} from "../styles/ButtonStyles";
import PropTypes from "prop-types";
import {Colors} from "../styles/Variables";
import {TextStyles} from "../styles/TextStyles";

export default class  ActionButton extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <View style={ButtonStyles.action.main}>
                <TouchableHighlight
                    onPress={() => this.props.onPress()}
                    activeOpacity={1}
                    underlayColor={this.props.background}
                    style={{
                        backgroundColor: this.props.color,
                        padding: 20
                    }}
                >
                    <View style={[{
                        width: this.props.size,
                        height: this.props.size
                    }]}>
                        <Image
                            source={this.props.src}
                            style={[ButtonStyles.action.icon, {
                                tintColor: this.props.iconTint
                            }]}
                            resizeMode='contain'
                        />
                    </View>
                </TouchableHighlight>
            </View>
        );

    }
}


ActionButton.propTypes = {
    size: PropTypes.number,
    src: PropTypes.node.isRequired,
    onPress: PropTypes.func.isRequired,
    color: PropTypes.string,
    background: PropTypes.string,
    iconTint: PropTypes.string
};
ActionButton.defaultProps = {
    size: 20,
    src: null,
    onPress: null,
    color: Colors.primary,
    background: Colors.primaryDark,
    iconTint: Colors.background
};