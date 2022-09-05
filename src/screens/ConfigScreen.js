import {StatusBar} from 'expo-status-bar';
import {Pressable, Text, View} from 'react-native';
import Screen from "../abstract/Screen";
import {ScreenStyles} from "../styles/ScreenStyles";
import DateTimeWidget from "../components/DateTimeWidget";
import {TextStyles, TS} from "../styles/TextStyles";
import NumberSelect from "../components/NumberSelect";
import AlertHelper from "../services/AlertHelper";
import DebugHelper from "../services/DebugHelper";
import ProtocolService from "../services/ProtocolService";
import {ButtonStyles} from "../styles/ButtonStyles";
import EventSystem from "../services/EventSystem";
import ConfigService, {configEvents, defaultConfig} from "../services/ConfigService";
import {Colors} from "../styles/Variables";
import {Column, Layout, Row} from "../components/layout/Layout";
import SelectComponent from "../components/SelectComponent";
import ModalComponent from "../components/ModalComponent";
import Icon from "../components/Icon";


const allowedUnits = [
    {key: 'week', value: 'Woche'},
    {key: 'month', value: 'Monat'},
    {key: 'year', value: 'Jahr'}
];

export default class ConfigScreen extends Screen {

    state = {
        unit: defaultConfig.timeUnit,
        hoursPerUnit: defaultConfig.hoursPerUnit,
        defaultBreakTime: defaultConfig.breakTime,
        startOfMeasurementMs: defaultConfig.startOfMeasurement,
        backlogThreshold: defaultConfig.backlogThreshold,
        ignoredHoursInUnitBeforeStart: defaultConfig.ignoredHoursInUnitBeforeStart,

        currentModal: null
    }

    constructor(props) {
        super(props);
        this.saveTimeout = null;
        EventSystem.subscribe(configEvents.configInitialized, this.updateConfig, this);
        this.updateConfig();
    }

    updateConfig() {
        let config = ConfigService.getInstance();
        this.setState({
            unit: config.get('timeUnit', defaultConfig.timeUnit),
            hoursPerUnit: config.get('hoursPerTimeUnit', defaultConfig.hoursPerUnit),
            defaultBreakTime: config.get('defaultBreakTime', defaultConfig.breakTime),
            startOfMeasurementMs: config.get('startOfMeasurementMs', defaultConfig.startOfMeasurement),
            backlogThreshold: config.get('backlogThreshold', defaultConfig.backlogThreshold),
            ignoredHoursInUnitBeforeStart: config.get('ignoredHoursInUnitBeforeStart', defaultConfig.ignoredHoursInUnitBeforeStart)
        });
    }

    onChange() {
        this.navigation.setOptions({
            headerTitle: 'Einstellungen *'
        })

        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }
        // give 500ms to the user for changing the config again, before saving
        // this prevents the app from saving on every button press
        this.saveTimeout = setTimeout(this.onSaveChanges.bind(this), 500);
    }

    onSaveChanges() {
        this.saveTimeout = null;

        let config = ConfigService.getInstance();
        config.set('timeUnit', this.state.unit);
        config.set('hoursPerTimeUnit', this.state.hoursPerUnit);
        config.set('defaultBreakTime', this.state.defaultBreakTime);
        config.set('startOfMeasurementMs', this.state.startOfMeasurementMs);
        config.set('backlogThreshold', this.state.backlogThreshold);
        config.set('ignoredHoursInUnitBeforeStart', this.state.ignoredHoursInUnitBeforeStart);

        config.save();
        this.updateConfig();
        this.navigation.setOptions({
            headerTitle: 'Einstellungen'
        })
    }

    /**
     * @param {string} key
     */
    getUnitByKey(key) {
        for (let unit of allowedUnits) {
            if (unit.key === key) {
                return unit;
            }
        }
        return null;
    }


    render() {
        return (
            <View style={ScreenStyles.container}>
                <StatusBar backgroundColor={Colors.background} style="light"/>

                <Layout>
                    <View style={TextStyles.spacer.m}/>

                    <Row>
                        <Column size={4}>
                            <Text style={TextStyles.default}>Zeitabschnitt</Text>
                        </Column>
                        <Column size={1}>
                            <Icon
                                icon={'question'}
                                onPress={() => this.setState({ currentModal: 'timeUnit'})}
                            />
                        </Column>
                        <Column size={5} vAlign={'center'}>
                            <SelectComponent
                                data={allowedUnits}
                                default={this.getUnitByKey(this.state.unit)}
                                onChange={value => {
                                    this.setState({unit: value.key}, this.onChange.bind(this));
                                }}
                            />
                        </Column>
                    </Row>

                    <View style={TextStyles.spacer.l}/>

                    <Row>
                        <Column size={4}>
                            <Text style={TextStyles.default}>Stunden pro Zeitabschnitt</Text>
                        </Column>
                        <Column size={1}>
                            <Icon
                                icon={'question'}
                                onPress={() => this.setState({ currentModal: 'hoursPerUnit'})}
                            />
                        </Column>
                        <Column size={5} vAlign={'center'}>
                            <NumberSelect
                                onChange={value => {
                                    this.setState({hoursPerUnit: parseInt(value ?? '0')}, this.onChange.bind(this));
                                }}
                                min={0}
                                initial={this.state.hoursPerUnit}
                            />
                        </Column>
                    </Row>

                    <View style={TextStyles.spacer.l}/>

                    <Row>
                        <Column size={4}>
                            <Text style={TextStyles.default}>Stunden für Rückstands-Warnung</Text>
                        </Column>
                        <Column size={1}>
                            <Icon
                                icon={'question'}
                                onPress={() => this.setState({ currentModal: 'backlogThreshold'})}
                            />
                        </Column>
                        <Column size={5} vAlign={'center'}>
                            <NumberSelect
                                onChange={value => {
                                    this.setState({backlogThreshold: parseInt(value ?? '0')}, this.onChange.bind(this));
                                }}
                                initial={this.state.backlogThreshold}
                            />
                        </Column>
                    </Row>

                    <View style={TextStyles.spacer.l}/>

                    <Row>
                        <Column size={4}>
                            <Text style={TextStyles.default}>Standard Minuten pro Pause</Text>
                        </Column>
                        <Column size={1}>
                            <Icon
                                icon={'question'}
                                onPress={() => this.setState({ currentModal: 'defaultBreakTime'})}
                            />
                        </Column>
                        <Column size={5} vAlign={'center'}>
                            <NumberSelect
                                onChange={value => {
                                    this.setState({defaultBreakTime: parseInt(value ?? '0')}, this.onChange.bind(this));
                                }}
                                min={0}
                                max={600}
                                initial={this.state.defaultBreakTime}
                            />
                        </Column>
                    </Row>

                    <View style={TextStyles.spacer.l}/>

                    <Row>
                        <Column size={4}>
                            <Text style={TextStyles.default}>Messungsbeginn</Text>
                        </Column>
                        <Column size={1}>
                            <Icon
                                icon={'question'}
                                onPress={() => this.setState({ currentModal: 'startOfMeasurementMs'})}
                            />
                        </Column>
                        <Column size={5} vAlign={'center'}>
                            <DateTimeWidget
                                value={this.state.startOfMeasurementMs}
                                hideTime={true}
                                onChange={(newTime) => {
                                    this.setState({startOfMeasurementMs: newTime}, this.onChange.bind(this))
                                }}
                            />
                        </Column>
                    </Row>

                    <View style={TextStyles.spacer.l}/>

                    <Row>
                        <Column size={4}>
                            <Text style={TextStyles.default}>Stunden zur Messbeginn Kalibrierung</Text>
                        </Column>
                        <Column size={1}>
                            <Icon
                                icon={'question'}
                                onPress={() => this.setState({ currentModal: 'ignoredHoursInUnitBeforeStart'})}
                            />
                        </Column>
                        <Column size={5} vAlign={'center'}>
                            <NumberSelect
                                onChange={value => {
                                    this.setState({ignoredHoursInUnitBeforeStart: parseInt(value ?? '0')}, this.onChange.bind(this));
                                }}
                                initial={this.state.ignoredHoursInUnitBeforeStart}
                            />
                        </Column>
                    </Row>

                </Layout>

                <View style={{ display: (this.route.params.debugMode) ? 'flex' : 'none' }}>
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
                                        () => ConfigService.getInstance()._clear()
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


                <ModalComponent
                    isVisible={this.state.currentModal === 'timeUnit'}
                    onCloseBtnPressed={() => this.setState({currentModal: null})}
                >
                    <Text style={[TS.header.minor, TS.default]}>Zeitabschnitt</Text>
                    <View style={TS.spacer.m}/>
                    <Text style={TS.default}>Über den Zeitabschnitt kann der berechnete Zeitraum für die angegebenen Stunden ausgewählt werden</Text>
                    <View style={TS.spacer.m}/>
                    <Text style={TS.default}>Abhängig davon wird auf der Startseite das entsprechende Stunden-Pensum aus dem Protokoll gefiltert und angezeigt.</Text>
                    <View style={TS.spacer.l}/>
                    <Text style={[TS.default, TS.bold]}>Beispiel:</Text>
                    <Text style={TS.default}>Wenn du deine Stunden pro Woche zählen möchtest, wähle hier die Option "Woche" aus</Text>
                </ModalComponent>

                <ModalComponent
                    isVisible={this.state.currentModal === 'hoursPerUnit'}
                    onCloseBtnPressed={() => this.setState({currentModal: null})}
                >
                    <Text style={[TS.header.minor, TS.default]}>Stunden pro Zeitabschnitt</Text>
                    <View style={TS.spacer.m}/>
                    <Text style={TS.default}>Als "Stunden pro Zeitabschnitt" können die erwarteten Stunden für den gewählten Zeitabschnitt festgelegt werden.</Text>
                    <View style={TS.spacer.m}/>
                    <Text style={TS.default}>Diese Zahl wird als Pensum angezeigt und davon abhängig auch der Gesamt-Satus </Text>
                    <View style={TS.spacer.l}/>
                    <Text style={[TS.default, TS.bold]}>Beispiel:</Text>
                    <Text style={TS.default}>Bei einer 40 Stunden Woche und dem gewählten Zeitabschnitt "Woche", wird hier 40 ausgewählt</Text>
                </ModalComponent>


                <ModalComponent
                    isVisible={this.state.currentModal === 'backlogThreshold'}
                    onCloseBtnPressed={() => this.setState({currentModal: null})}
                >
                    <Text style={[TS.header.minor, TS.default]}>Stunden für Rückstandswarnung</Text>
                    <View style={TS.spacer.m}/>
                    <Text style={TS.default}>Die hier ausgewählte Stundenzahl gibt an, ab welchem Gesamt-Status die Anzeige auf der Startseite rot gefärbt werden soll.</Text>
                    <View style={TS.spacer.l}/>
                    <Text style={[TS.default, TS.bold]}>Beispiel:</Text>
                    <Text style={TS.default}>Wenn du maximal 20 Stunden hinter dein Gesamt-Pensum fallen willst, kannst du diesen Wert auf 20 setzen. Fällst du nun mehr als 20 Stunden in den Rückstand, ändert sich die Farbe</Text>
                </ModalComponent>


                <ModalComponent
                    isVisible={this.state.currentModal === 'defaultBreakTime'}
                    onCloseBtnPressed={() => this.setState({currentModal: null})}
                >
                    <Text style={[TS.header.minor, TS.default]}>Standard Minuten pro Pause</Text>
                    <View style={TS.spacer.m}/>
                    <Text style={TS.default}>Hier kannst du angeben, wie viele Minuten bei der Protokollierung vorausgefüllt sein sollen. Dadurch musst du dieselbe Eingabe nicht jedes mal wiederholen</Text>
                </ModalComponent>


                <ModalComponent
                    isVisible={this.state.currentModal === 'startOfMeasurementMs'}
                    onCloseBtnPressed={() => this.setState({currentModal: null})}
                >
                    <Text style={[TS.header.minor, TS.default]}>Messungsbeginns</Text>
                    <View style={TS.spacer.m}/>
                    <Text style={TS.default}>Mit dieser Einstellung wird der Startzeitpunkt der Messung festgelegt. Dabei gilt dieser Tag bereits als die erste Messeinheit.</Text>
                    <View style={TS.spacer.m}/>
                    <Text style={TS.default}>Schaust du also an deinem eingestellten Datum auf die App, wird dir bereits das Pensum für die erste Einheit angezeigt.</Text>
                </ModalComponent>


                <ModalComponent
                    isVisible={this.state.currentModal === 'ignoredHoursInUnitBeforeStart'}
                    onCloseBtnPressed={() => this.setState({currentModal: null})}
                >
                    <Text style={[TS.header.minor, TS.default]}>Stunden zur Messbeginn Kalibrierung</Text>
                    <View style={TS.spacer.m}/>
                    <Text style={TS.default}>Manchmal beginnt die Messzeit nicht zeitgleich mit einer Messeinheit. Daher kannst du hier die Gesamtzeit kalibrieren um z.B. einen Arbeitsbeginn in der Wochenmitte auszugleichen.</Text>
                    <View style={TS.spacer.l}/>
                    <Text style={[TS.default, TS.bold]}>Beispiel:</Text>
                    <Text style={TS.default}>Wenn du beginnst, 40 Stunden pro Woche zu arbeiten, dein erster Arbeitstag aber ein Mittwoch ist, kannst du hier 16 einstellen.</Text>
                    <Text style={TS.default}>2 Tage á 8 Stunden = 16</Text>
                    <Text style={TS.default}>So wird dir diese Zeit nicht als fehlende Arbeitszeit angerechnet</Text>
                </ModalComponent>

            </View>
        );
    };
}