import { StatusBar } from 'expo-status-bar';
import {Image, ScrollView, Text, View} from 'react-native';
import Screen from "../abstract/Screen";
import {ScreenStyles} from "../styles/ScreenStyles";
import {Colors} from "../styles/Variables";
import ImageService from "../services/ImageService";
import ConfigService, {AppVersion} from "../services/ConfigService";
import TimeCalculations from "../services/TimeCalculations";
import {TextStyles} from "../styles/TextStyles";
import Condition from "../components/Condition";

export default class MessageScreen extends Screen {

    constructor(props) {
        super(props);
        this.configService = ConfigService.getInstance();

        this.oldInstalledVersion = this.configService.get('installedAppVersion');
        this.oldInstalledVersionInt = TimeCalculations.versionToInt(this.oldInstalledVersion);
        this.isFirstInstallation = this.oldInstalledVersion === '0.0.0';
        this.showAll             = this.oldInstalledVersion === AppVersion;

        if(!this.showAll) {
            // the board is shown because of a version update: update the version
            this.configService.set('installedAppVersion', AppVersion, true);
        }
    }

    static shouldShowMessageScreen(configService) {
        let installedAppVersion = configService.get('installedAppVersion');
        return installedAppVersion !== AppVersion;
    }

    render() {
        return (
            <View style={ScreenStyles.container}>
                <StatusBar backgroundColor={Colors.background} style="light" />

                <View style={{
                    width: '100%',
                    backgroundColor: Colors.gray100,
                    borderRadius: 10,
                    overflow: 'hidden'
                }}>
                    <Image
                        source={ImageService.getInstance().getImage('logoBackground')}
                        style={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'cover',
                            position: 'absolute'
                        }}
                    />
                    <Image
                        source={ImageService.getInstance().getImage('logoFull')}
                        style={{
                            width: '100%',
                            resizeMode: 'contain',
                            height: 150,
                            marginVertical: 20
                        }}
                    />
                </View>

                <View style={TextStyles.spacer.l} />
                <Text style={[TextStyles.header.minor, TextStyles.default, TextStyles.centered]}>Prototime v{AppVersion}</Text>
                <View style={TextStyles.spacer.l} />

                <ScrollView style={{
                    backgroundColor: Colors.gray100,
                    minHeight: 100,
                    minWidth: '100%',
                    padding: 20,
                    borderRadius: 10
                }}>

                    <Condition on={this.isFirstInstallation} style={{maxWidth: '100%'}}>
                        <Text style={[TextStyles.header.minor, TextStyles.default]}>
                            Vielen Dank, dass du dich f??r Prototime entschieden hast!
                        </Text>
                        <View style={TextStyles.spacer.m} />
                        <Text style={TextStyles.default}>
                            Prototime ist eine App zur Zeitprotokollierung auf Basis einer regelm????igen Zeitanforderung.
                        </Text>
                        <View style={TextStyles.spacer.s} />
                        <Text style={TextStyles.default}>
                            Bitte deaktiviere in deinen System-Einstellungen den Dark-Mode f??r diese App, da einige Betriebssysteme ansonsten das Farbschema eigenst??ndig ver??ndern k??nnten!
                        </Text>
                        <View style={TextStyles.spacer.xl} />
                    </Condition>

                    <Text style={[TextStyles.header.minor, TextStyles.default]}>Was ist neu?</Text>

                    <Condition on={this.showAll || this.oldInstalledVersionInt < TimeCalculations.versionToInt('0.7.1')}>
                        <View style={TextStyles.spacer.m} />
                        <Text style={[TextStyles.underlined, TextStyles.default]}>v0.7.1</Text>
                        <Text style={TextStyles.default}>- Fehler mit leerem Protokoll behoben</Text>
                        <Text style={TextStyles.default}>- Hinweise auf dem Ladebildschirm hinzugef??gt</Text>
                        <Text style={TextStyles.default}>- Alte Eintr??ge werden nun gel??scht, anstatt nur ??berschrieben zu werden</Text>
                    </Condition>

                    <Condition on={this.showAll || this.oldInstalledVersionInt < TimeCalculations.versionToInt('0.7.0')}>
                        <View style={TextStyles.spacer.m} />
                        <Text style={[TextStyles.underlined, TextStyles.default]}>v0.7.0</Text>
                        <Text style={TextStyles.default}>- Messageboard hinzugef??gt</Text>
                        <Text style={TextStyles.default}>- Automatische Versionerkennung und aktualisierung hinzugef??gt</Text>
                    </Condition>

                    <Condition on={this.showAll || this.oldInstalledVersionInt < TimeCalculations.versionToInt('0.6.0')}>
                        <View style={TextStyles.spacer.m} />
                        <Text style={[TextStyles.underlined, TextStyles.default]}>v0.6.0</Text>
                        <Text style={TextStyles.default}>- Neue Tracking-Funktion hinzugef??gt</Text>
                        <Text style={TextStyles.default}>- Zeitangaben am selben Tag zeigen im Protokoll nun nur noch einmal das Datum an</Text>
                        <Text style={TextStyles.default}>- Diverse Korrekturen am Farbschema und der Zeitkalkulation</Text>
                        <Text style={TextStyles.default}>- Der veraltete "Aktualisieren"-Button auf der Startseite wurde entfernt</Text>
                    </Condition>

                    <Condition on={this.showAll || this.oldInstalledVersionInt < TimeCalculations.versionToInt('0.5.0')}>
                        <View style={TextStyles.spacer.m} />
                        <Text style={[TextStyles.underlined, TextStyles.default]}>v0.5.0</Text>
                        <Text style={TextStyles.default}>- Layoutanpassungen auf der Startseite</Text>
                        <Text style={TextStyles.default}>- Debug Modus hinzugef??gt (tippe 5x auf das Wort "Prototime" im Hauptbildschirm)</Text>
                        <Text style={TextStyles.default}>- Ladebildschirm hinzugef??gt</Text>
                        <Text style={TextStyles.default}>- Inhalte aktualisieren sich nun ??ber Events selbstst??ndig und sofort nach ??nderungen</Text>
                    </Condition>

                    <Condition on={this.showAll || this.oldInstalledVersionInt < TimeCalculations.versionToInt('0.4.0')}>
                        <View style={TextStyles.spacer.m} />
                        <Text style={[TextStyles.underlined, TextStyles.default]}>v0.4.0</Text>
                        <Text style={TextStyles.default}>- Eintr??ge im Protokoll k??nnen nun bearbeitet und gel??scht werden</Text>
                        <Text style={TextStyles.default}>- F??r die Zahlenauswahl wird jetzt aufgrund von Darstellugnsfehlern ein anderes Plugin verwendet</Text>
                        <Text style={TextStyles.default}>- Configuration hinzugef??gt</Text>
                    </Condition>

                    <Condition on={this.showAll || this.oldInstalledVersionInt < TimeCalculations.versionToInt('0.3.0')}>
                        <View style={TextStyles.spacer.m} />
                        <Text style={[TextStyles.underlined, TextStyles.default]}>v0.3.0</Text>
                        <Text style={TextStyles.default}>- F??r Protokoll-Eintr??ge kann nun eine Pausenzeit und ein Kommentar definiert werden</Text>
                        <Text style={TextStyles.default}>- Die Darstellung von Zeitangaben wurde angepasst</Text>
                    </Condition>

                    <Condition on={this.showAll || this.oldInstalledVersionInt < TimeCalculations.versionToInt('0.2.0')}>
                        <View style={TextStyles.spacer.m} />
                        <Text style={[TextStyles.underlined, TextStyles.default]}>v0.2.0</Text>
                        <Text style={TextStyles.default}>- Graphische Darstellung f??r den Hauptbildschirm hinzugef??gt</Text>
                        <Text style={TextStyles.default}>- ??nderungen am Layout</Text>
                        <Text style={TextStyles.default}>- Allgemeine Code Verbesserungen</Text>
                    </Condition>

                    <Condition on={this.showAll || this.oldInstalledVersionInt < TimeCalculations.versionToInt('0.1.0')}>
                        <View style={TextStyles.spacer.m} />
                        <Text style={[TextStyles.underlined, TextStyles.default]}>v0.1.0 Alpha</Text>
                        <Text style={TextStyles.default}>- Initiale Erstellung</Text>
                        <Text style={TextStyles.default}>- Zeitprotokoll und simple Rechnugnen hinzugef??gt</Text>
                    </Condition>

                    <View style={TextStyles.spacer.xl}/>
                </ScrollView>

            </View>
        );
    };
}