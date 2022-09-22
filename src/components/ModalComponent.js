import {Component} from "react";
import {Pressable, Text, View} from "react-native";
import {ReactNativeModal} from "react-native-modal";
import {Colors} from "../styles/Variables";
import PropTypes from "prop-types";
import Icon from "./Icon";

export default class ModalComponent extends Component {

    render() {
        return (
            <View>
                <ReactNativeModal
                    isVisible={this.props.isVisible}
                    onBackdropPress={() => this.props.onCloseBtnPressed()}
                    onSwipeComplete={() => this.props.onCloseBtnPressed()}
                    swipeDirection="down"
                    animationIn={'fadeInUp'}
                    animationOut={'fadeOutDown'}
                    backdropTransitionOutTiming={0}
                    hasBackdrop={true}
                >
                    <View style={{
                        flex: 1,
                        backgroundColor: Colors.background,
                        padding: 20
                    }}>
                        {this.props.children}
                    </View>
                </ReactNativeModal>
            </View>
        );
    }
}

ModalComponent.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onCloseBtnPressed: PropTypes.func,
};
ModalComponent.defaultProps = {
    isVisible: false,
    onCloseBtnPressed: () => {}
};