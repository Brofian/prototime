import { StatusBar } from 'expo-status-bar';
import {Alert, Button, Image, Pressable, Text, TouchableHighlight, View} from 'react-native';
import Screen from "../abstract/Screen";
import {ScreenStyles} from "../styles/ScreenStyles";
import DateTimeWidget from "../components/DateTimeWidget";
import {TableLayoutStyles} from "../styles/TableLayoutStyles";
import {TextStyles} from "../styles/TextStyles";
import {Colors} from "../styles/Variables";
import NumericInput from "react-native-numeric-input";
import NumberSelect from "../components/NumberSelect";

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
                            <Text>Stunden pro Zeitabschnitt</Text>
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
                            <Text>Standard Minuten pro Pause</Text>
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
                            <Text>Messungsbeginn</Text>
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



                <View style={{ flex: 1 }}>
                    <Pressable
                        onPress={() => {
                            Alert.alert(
                                'Wirklich löschen?',
                                'Wenn du das tust, gehen alle deine Daten unwiederruflich verloren. Bist du dir sicher?',
                                [
                                    {
                                        text: "Abbrechen",
                                        style: "cancel",
                                    },
                                    {
                                        text: "Löschen",
                                        style: "confirm",
                                        //onPress={() => ProtocolService.getInstance()._clear()}
                                    },
                                ],
                            );
                        }}
                    >
                        <Text>Alle Daten löschen</Text>
                    </Pressable>
                </View>

            </View>
        );
    };
}