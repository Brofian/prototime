import {StatusBar} from 'expo-status-bar';
import {Pressable, Text, View} from 'react-native';
import Screen from "../abstract/Screen";
import {ScreenStyles} from "../styles/ScreenStyles";
import {TextStyles, TS} from "../styles/TextStyles";
import AlertHelper from "../services/AlertHelper";
import DebugHelper from "../services/DebugHelper";
import ProtocolService from "../services/ProtocolService";
import {ButtonStyles} from "../styles/ButtonStyles";
import ConfigService from "../services/ConfigService";
import {Colors} from "../styles/Variables";


export default class DebugScreen extends Screen {

    render() {
        return (
            <View style={ScreenStyles.container}>
                <StatusBar backgroundColor={Colors.background} style="light"/>

                <Pressable
                    onPress={() => this.navigation.navigate('Message')}
                    style={ButtonStyles.secondary}
                >
                    <Text style={TextStyles.default}>Messageboard öffnen</Text>
                </Pressable>

                <View style={TextStyles.spacer.m}/>


                <Pressable
                    onPress={() => {
                        AlertHelper.confirm(
                            'Wirklich löschen?',
                            'Wenn du das tust, gehen alle deine Daten unwiederruflich verloren. Bist du dir sicher?',
                            'Bestätigen',
                            () => {
                                AlertHelper.confirm(
                                    'Bist du sicher?',
                                    'Das ist meine letzte Warnung. Es ist alles weg!',
                                    'Ich bin sicher!',
                                    () => ProtocolService.getInstance()._clear()
                                );
                            }
                        );
                    }}
                    style={ButtonStyles.secondary}
                >
                    <Text style={TextStyles.default}>Alle Daten löschen</Text>
                </Pressable>

                <View style={TextStyles.spacer.m}/>

                <Pressable
                    onPress={() => {
                        AlertHelper.confirm(
                            'Wirklich zurücksetzen?',
                            'Wenn du das tust, gehen alle deine Einstellungen unwiederruflich verloren. Bist du dir sicher?',
                            'Bestätigen',
                            () => {
                                AlertHelper.confirm(
                                    'Bist du sicher?',
                                    'Das ist meine letzte Warnung. Es ist alles auf Anfang!',
                                    'Ich bin sicher!',
                                    () => ConfigService.getInstance()._clear(this.updateConfig.bind(this))
                                );
                            }
                        );
                    }}
                    style={ButtonStyles.secondary}
                >
                    <Text style={TextStyles.default}>Einstellungen zurücksetzen</Text>
                </Pressable>

                <View style={TextStyles.spacer.m}/>

                <Pressable
                    onPress={DebugHelper.createExampleEntry}
                    style={ButtonStyles.secondary}
                >
                    <Text style={TextStyles.default}>Debug Eintrag erstellen</Text>
                </Pressable>

            </View>
        );
    };
}