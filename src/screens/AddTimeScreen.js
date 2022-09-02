import { StatusBar } from 'expo-status-bar';
import {Button, Text, View} from 'react-native';
import Screen from "../abstract/Screen";
import {ScreenStyles} from "../styles/ScreenStyles";
import DateTimeWidget from "../components/DateTimeWidget";



export default class AddTimeScreen extends Screen {

    state = {
        start: new Date(),
        end: new Date(),
    }

    render() {
        return (
            <View style={ScreenStyles.container}>


                <View style={{flex: 0, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start'}}>

                    <View style={{ flex: 1 }}>
                        <Text style={{ flex: 0 }}>Von: </Text>
                    </View>

                    <View style={{ flex: 2, alignItems: 'flex-start' }}>
                        <DateTimeWidget
                            value={this.state.start}
                            onChange={(newDate) => this.setState({ start: newDate})}
                            style={{ alignItems: 'center', justifyContent: 'center'}}
                        />
                    </View>

                </View>

                <View style={{flex: 0, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start'}}>

                    <View style={{ flex: 1 }}>
                        <Text style={{ flex: 0 }}>Bis: </Text>
                    </View>

                    <View style={{ flex: 2, alignItems: 'flex-start' }}>
                        <DateTimeWidget
                            value={this.state.end}
                            onChange={(newDate) => this.setState({ end: newDate})}
                            style={{ alignItems: 'center', justifyContent: 'center'}}
                        />
                    </View>

                </View>

            </View>
        );
    };


}
