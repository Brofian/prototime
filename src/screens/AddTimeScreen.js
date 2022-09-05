import { StatusBar } from 'expo-status-bar';
import {Button, LogBox, Pressable, Text, TextInput, View} from 'react-native';
import Screen from "../abstract/Screen";
import {ScreenStyles} from "../styles/ScreenStyles";
import DateTimeWidget from "../components/DateTimeWidget";
import {WidgetStyles} from "../styles/WidgetStyles";
import {TextStyles} from "../styles/TextStyles";
import {TableLayoutStyles} from "../styles/TableLayoutStyles";
import ProtocolService from "../services/ProtocolService";
import {Colors} from "../styles/Variables";
import NumberSelect from "../components/NumberSelect";
import ConfigService from "../services/ConfigService";
import {defaultConfig} from "../services/ConfigService";
import Container from "@react-navigation/native-stack/src/views/DebugContainer.native";

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

export default class AddTimeScreen extends Screen {


    state = {
        start: (new Date()).getTime(),
        end: (new Date()).getTime(),
        break: 0,
        comment: '',
        error: '',

        breakDefault: 20
    }

    constructor(props) {
        super(props);
        this.defaultBreak = 0;
        this.state.break = this.defaultBreak;
    }


    onSave() {
        let duration = this.state.end - this.state.start - (this.state.break*1000*60);

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
                this.state.comment,
                this.state.break
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
                <StatusBar backgroundColor={Colors.background} style="light" />


                <Text style={[TextStyles.header.minor, TextStyles.default]}>Füge einen neuen Eintrag hinzu</Text>

                <View style={TextStyles.spacer.xl}></View>

                <View style={TableLayoutStyles.row}>
                    <View style={{ flex: 1 }}>
                        <Text style={TextStyles.default}>Anfang: </Text>
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
                        <Text style={TextStyles.default}>Ende: </Text>
                    </View>

                    <View style={{ flex: 2, alignItems: 'flex-start' }}>
                        <DateTimeWidget
                            value={this.state.end}
                            minDateFunc={this.getCurrentStart.bind(this)}
                            onChange={(newTime) => this.setState({ end: newTime})}
                        />
                    </View>
                </View>


                <View style={TextStyles.spacer.m}></View>

                <View style={TableLayoutStyles.row}>
                    <View style={{ flex: 1 }}>
                        <Text style={TextStyles.default}>Pause (min): </Text>
                    </View>

                    <View style={{ flex: 2, alignItems: 'flex-start' }}>
                        <NumberSelect
                            onChange={value => this.setState({break: parseInt(value??'0')})}
                            min={0}
                            max={600}
                            initial={ConfigService.getInstance().get('defaultBreakTime', defaultConfig.breakTime)}
                        />
                    </View>
                </View>


                <View style={TextStyles.spacer.xl}></View>

                <TextInput
                    multiline
                    style={WidgetStyles.textarea}
                    onChangeText={(newText) => {this.setState({comment: newText})}}
                    value={this.state.comment}
                    placeholder={'Beschreibung (optional)'}
                    placeholderTextColor={Colors.text}
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
