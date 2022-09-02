import { StatusBar } from 'expo-status-bar';
import Screen from "../abstract/Screen";
import {ScreenStyles} from "../styles/ScreenStyles";
import {FlatList, Pressable, Text, View} from "react-native";
import ActionButton from "../components/ActionButton";
import {Colors} from "../styles/Variables";
import ProtocolService from "../services/ProtocolService";
import DateTimeWidget from "../components/DateTimeWidget";
import {TextStyles} from "../styles/TextStyles";


export default class TimeListingScreen extends Screen {

    state = {
        elements: []
    }

    constructor(props) {
        super(props);

        this.state.elements = ProtocolService.getInstance().getEntries();
        ProtocolService.getInstance().getEmitter().addListener('initialized', this.refreshListing, this);
    }

    refreshListing() {
        let entries = ProtocolService.getInstance().getEntries();
        this.setState({
            elements: entries
        });
    }

    renderItem(item, index, separators) {
        let duration = new Date(item.item.duration);
        let start = new Date(item.item.start);
        let breakTime = item.item.breakTime;
        let end = new Date(item.item.start + item.item.duration + ((breakTime??0)*1000*60));
        let comment = item.item.comment;


        return (
            <View>
                <Text style={TextStyles.header.major}>{DateTimeWidget.toTime(duration, true)}h</Text>
                <Text>{DateTimeWidget.toFullDateTime(start)} bis {DateTimeWidget.toFullDateTime(end)}</Text>
                {!breakTime ? '' : <Text>Zzgl. {breakTime} Minuten Pause</Text>}
                {!comment       ? '' : <Text>{comment}</Text>}
                <View style={TextStyles.spacer.m} />
            </View>
        );
    }

    render() {
        return (
            <View style={ScreenStyles.container}>
                <StatusBar style="auto"/>

                <Pressable
                    //onPress={() => ProtocolService.getInstance()._clear()}
                >
                    <Text>Clear all</Text>
                </Pressable>

                <FlatList
                    data={this.state.elements}
                    renderItem={this.renderItem}
                    style={{
                        width: '100%'
                    }}
                />

                <ActionButton
                    src={require('../assets/icons/plus.png')}
                    color={Colors.primary}
                    background={Colors.primaryDark}
                    onPress={() => {
                        this.navigation.navigate('AddTime', {
                            onGoBack: this.refreshListing.bind((this))
                        })
                    }}
                    size={20}
                />

            </View>
        );
    };
}