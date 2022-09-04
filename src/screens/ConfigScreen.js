import { StatusBar } from 'expo-status-bar';
import {Pressable, Text, View} from 'react-native';
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
import EventSystem from "../services/EventSystem";
import ConfigService, {configEvents} from "../services/ConfigService";
import SelectComponent from "../components/SelectComponent";
import {Colors} from "../styles/Variables";

export const defaultConfig = {
    timeUnit: 'month',
    hoursPerUnit: 40,
    breakTime: 0,
    startOfMeasurement: (new Date('2022/09/01')).getTime(),

};

const allowedUnits = [
    {key:'week',   value:'Woche'},
    {key:'month',  value:'Monat'},
    {key:'year',   value:'Jahr'}
];

export default class ConfigScreen extends Screen {

    state = {
        unit: defaultConfig.timeUnit,
        hoursPerUnit: defaultConfig.hoursPerUnit,
        defaultBreakTime: defaultConfig.breakTime,
        startOfMeasurementMs: defaultConfig.startOfMeasurement
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
            unit:                   config.get('timeUnit', defaultConfig.timeUnit),
            hoursPerUnit:           config.get('hoursPerTimeUnit', defaultConfig.hoursPerUnit),
            defaultBreakTime:       config.get('defaultBreakTime', defaultConfig.breakTime),
            startOfMeasurementMs:   config.get('startOfMeasurementMs', defaultConfig.startOfMeasurement),
        });
    }

    onChange() {
        this.navigation.setOptions({
            headerTitle: 'Einstellungen *'
        })

        if(this.saveTimeout) {
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
        for(let unit of allowedUnits) {
            if(unit.key === key) {
                return unit;
            }
        }
        return null;
    }

    render() {
        return (
            <View style={ScreenStyles.container}>
                <StatusBar backgroundColor={Colors.gray700} barStyle="dark-content" />


                <View style={{ flex: 1, flexDirection: 'column', alignContent: 'flex-start'}}>

                    <View style={TextStyles.spacer.m} />

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
                                hideTime={true}
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

/*

<View style={TableLayoutStyles.row}>
                        <View style={{ flex: 2 }}>
                            <Text style={TextStyles.default}>Zeitabschnitt</Text>
                        </View>
                        <View style={{ flex: 3, alignItems: 'center' }}>
                            <SelectComponent
                                data={allowedUnits}
                                default={this.getUnitByKey('week')}
                            />
                        </View>
                    </View>

 */