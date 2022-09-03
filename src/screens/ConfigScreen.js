import { StatusBar } from 'expo-status-bar';
import {Alert, Button, Image, Pressable, Text, TouchableHighlight, View} from 'react-native';
import Screen from "../abstract/Screen";
import {ScreenStyles} from "../styles/ScreenStyles";
import DateTimeWidget from "../components/DateTimeWidget";
import {TableLayoutStyles} from "../styles/TableLayoutStyles";
import {TextStyles} from "../styles/TextStyles";
import NumberSelect from "../components/NumberSelect";
import AlertHelper from "../services/AlertHelper";
import DebugHelper from "../services/DebugHelper";
import ProtocolService from "../services/ProtocolService";
import {ButtonStyles} from "../styles/ButtonStyles";

export default class ConfigScreen extends Screen {

    state = {
        unit: 'month',
        hoursPerUnit: 40,
        defaultBreakTime: 0,
        startOfMeasurementMs: 0
    }


    onChange() {
        // save on the fly
    }


    render() {
        return (
            <View style={ScreenStyles.container}>
                <StatusBar style="auto"/>

                <View style={{ flex: 1, flexDirection: 'column', alignContent: 'flex-start'}}>

                    <View style={TableLayoutStyles.row}>
                        <View style={{ flex: 2 }}>
                            <Text style={TextStyles.default}>Stunden pro Zeitabschnitt</Text>
                        </View>
                        <View style={{ flex: 3, alignItems: 'center' }}>
                            <NumberSelect
                                onChange={value => {
                                    this.setState({hoursPerUnit: parseInt(value??'0')}, this.onChange.bind(this));
                                }}
                                min={0}
                                initial={this.state.hoursPerUnit}
                            />
                        </View>
                    </View>

                    <View style={TextStyles.spacer.l} />

                    <View style={TableLayoutStyles.row}>
                        <View style={{ flex: 2 }}>
                            <Text style={TextStyles.default}>Standard Minuten pro Pause</Text>
                        </View>
                        <View style={{ flex: 3, alignItems: 'center' }}>
                            <NumberSelect
                                onChange={value => {
                                    this.setState({defaultBreakTime: parseInt(value??'0')}, this.onChange.bind(this));
                                }}
                                min={0}
                                max={600}
                                initial={this.state.defaultBreakTime}
                            />
                        </View>
                    </View>

                    <View style={TextStyles.spacer.l} />

                    <View style={TableLayoutStyles.row}>
                        <View style={{ flex: 2 }}>
                            <Text style={TextStyles.default}>Messungsbeginn</Text>
                        </View>
                        <View style={{ flex: 3, alignItems: 'center' }}>
                            <DateTimeWidget
                                value={this.state.startOfMeasurementMs}
                                onChange={(newTime) => {
                                    this.setState({ startOfMeasurementMs: newTime}, this.onChange.bind(this))
                                }}
                            />
                        </View>
                    </View>

                </View>



                <View>
                    <Pressable
                        onPress={() => {
                            AlertHelper.confirm(
                                'Wirklich löschen?',
                                'Wenn du das tust, gehen alle deine Daten unwiederruflich verloren. Bist du dir sicher?',
                                () => {
                                    AlertHelper.confirm(
                                        'Bist du sicher?',
                                        'Das ist meine letzte Warnung. Es ist alles weg!',
                                        () => ProtocolService.getInstance()._clear()
                                    );
                                }
                            );
                        }}
                        style={ButtonStyles.secondary}
                    >
                        <Text style={TextStyles.default}>Alle Daten löschen</Text>
                    </Pressable>
                </View>

                <View style={TextStyles.spacer.m} />

                <View>
                    <Pressable
                        onPress={DebugHelper.createExampleEntry}
                        style={ButtonStyles.secondary}
                    >
                        <Text style={TextStyles.default}>Debug Eintrag erstellen</Text>
                    </Pressable>
                </View>

            </View>
        );
    };
}