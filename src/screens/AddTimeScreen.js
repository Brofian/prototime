import { StatusBar } from 'expo-status-bar';
import {Button, LogBox, Pressable, Text, TextInput, View} from 'react-native';
import Screen from "../abstract/Screen";
import {ScreenStyles} from "../styles/ScreenStyles";
import DateTimeWidget from "../components/DateTimeWidget";
import {WidgetStyles} from "../styles/WidgetStyles";
import {TextStyles} from "../styles/TextStyles";
import {TableLayoutStyles} from "../styles/TableLayoutStyles";
import ProtocolService from "../services/ProtocolService";

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

export default class AddTimeScreen extends Screen {


    state = {
        start: (new Date()).getTime(),
        end: (new Date()).getTime(),
        comment: '',
        error: ''
    }

    onSave() {
        let duration = this.state.end - this.state.start;

        if(duration < (1000*60*5)) {
            this.setState({
                error: 'Der Zeitraum muss über 5 Minuten liegen!'
            });
            return;
        }

        try {
            ProtocolService.getInstance().createEntry(
                this.state.start,
                duration,
                this.comment
            );

            this.setState({
                error: ''
            });
        }
        catch (err) {
            this.setState({
                error: err.toString()
            });
            return;
        }

        this.route.params.onGoBack();
        this.navigation.goBack(null);
    }

    getCurrentStart() {
        return this.state.start;
    }

    render() {
        return (
            <View style={ScreenStyles.container}>

                <Text style={TextStyles.header.minor}>Füge einen neuen Eintrag hinzu</Text>

                <View style={TextStyles.spacer.xl}></View>

                <View style={TableLayoutStyles.row}>
                    <View style={{ flex: 1 }}>
                        <Text>Anfang: </Text>
                    </View>

                    <View style={{ flex: 2, alignItems: 'flex-start' }}>
                        <DateTimeWidget
                            value={this.state.start}
                            onChange={(newTime) => {this.setState({ start: newTime})}}
                        />
                    </View>
                </View>

                <View style={TextStyles.spacer.m}></View>

                <View style={TableLayoutStyles.row}>
                    <View style={{ flex: 1 }}>
                        <Text>Ende: </Text>
                    </View>

                    <View style={{ flex: 2, alignItems: 'flex-start' }}>
                        <DateTimeWidget
                            value={this.state.end}
                            minDateFunc={this.getCurrentStart.bind(this)}
                            onChange={(newTime) => this.setState({ end: newTime})}
                        />
                    </View>
                </View>

                <View style={TextStyles.spacer.xl}></View>

                <TextInput
                    multiline
                    style={WidgetStyles.textarea}
                    onChangeText={(newText) => {this.setState({comment: newText})}}
                    value={this.state.comment}
                    placeholder={'Beschreibung'}
                />

                <View style={TextStyles.spacer.xl}></View>

                {
                    !this.state.error ? '' :
                        <View>
                            <Text style={TextStyles.hasError}>{this.state.error}</Text>
                            <View style={TextStyles.spacer.l}></View>
                        </View>
                }

                <Pressable
                    style={WidgetStyles.button}
                    onPress={this.onSave.bind(this)}
                >
                    <Text>Speichern</Text>
                </Pressable>

            </View>
        );
    };


}
