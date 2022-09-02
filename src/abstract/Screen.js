import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {Component} from "react";

export default class Screen extends Component {

    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.onConstruct();
    }

    onConstruct() {}

    redirect(screenName) {
        this.navigation.navigate(screenName);
    }

    closeScreen() {
        this.navigation.goBack(null);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>TODO: override the render method!</Text>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
