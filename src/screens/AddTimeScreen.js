import { StatusBar } from 'expo-status-bar';
import {Button, Pressable, Text, TextInput, View} from 'react-native';
import Screen from "../abstract/Screen";
import {ScreenStyles} from "../styles/ScreenStyles";
import DateTimeWidget from "../components/DateTimeWidget";
import {WidgetStyles} from "../styles/WidgetStyles";
import {TextStyles} from "../styles/TextStyles";
import {TableLayoutStyles} from "../styles/TableLayoutStyles";
import ProtocolService from "../services/ProtocolService";



export default class AddTimeScreen extends Screen {

    state = {
        start: new Date(),
        end: new Date(),
        comment: '',
        error: ''
    }

    onSave() {
        let duration = ProtocolService.getDuration(this.state.start, this.state.end);

        if(duration < (1000*60*5)) {
            this.setState({
                error: 'Der Zeitraum muss über 5 Minuten liegen!'
            });
            return;
        }

        this.setState({
            error: ''
        });

        try {
            ProtocolService.getInstance().createEntry(
                this.state.start,
                duration,
                this.comment
            );
        }
        catch (err) {
            this.setState({
                error: err
            });
        }

        this.closeScreen();
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
                            onChange={(newDate) => this.setState({ start: newDate})}
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
                            minDate={this.state.start}
                            onChange={(newDate) => this.setState({ end: newDate})}
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
