import {Component} from "react";
import {Image, TouchableHighlight, View} from "react-native";
import {Colors} from "../styles/Variables";
import {ButtonStyles} from "../styles/ButtonStyles";

export default class ActionButton extends Component {

    constructor(props) {
        super(props);
        this.onPress = props.onPress;
        this.src = props.src;
        this.size = props.size;
        this.color = props.color;
        this.background = props.background;
    }

    render() {

        return (
            <View style={ButtonStyles.action.main}>
                <TouchableHighlight
                    onPress={this.onPress()}
                    activeOpacity={1}
                    underlayColor={this.background}
                    style={{
                        backgroundColor: this.color,
                        padding: 15
                    }}
                >
                    <View style={[{
                        width: this.size,
                        height: this.size
                    }]}>
                        <Image
                            source={this.src}
                            style={ButtonStyles.action.icon}
                            resizeMode='contain'
                        />
                    </View>
                </TouchableHighlight>
            </View>
        );

    }

}