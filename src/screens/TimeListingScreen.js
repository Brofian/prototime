import { StatusBar } from 'expo-status-bar';
import Screen from "../abstract/Screen";
import {ScreenStyles} from "../styles/ScreenStyles";
import {FlatList, Pressable, Text, TouchableWithoutFeedback, View} from "react-native";
import ActionButton from "../components/ActionButton";
import {Colors} from "../styles/Variables";
import ProtocolService, {protocolEvents} from "../services/ProtocolService";
import DateTimeWidget from "../components/DateTimeWidget";
import {TextStyles} from "../styles/TextStyles";
import EventSystem from "../services/EventSystem";


export default class TimeListingScreen extends Screen {

    state = {
        elements: [],
        selectedIndex: -1,
        hoveredIndex: -1
    }

    constructor(props) {
        super(props);

        EventSystem.subscribe(protocolEvents.protocolChanged, this.refreshListing, this);
        this.refreshListing();
    }

    refreshListing() {
        let entries = ProtocolService.getInstance().getEntries();
        this.setState({
            elements: entries
        });
    }

    onItemSelect(item) {

        this.navigation.navigate('EditTime', {
            item: item.item,
            onGoBack: this.refreshListing.bind((this))
        })

        this.setState({
            selectedIndex: item.item.key
        });
    }

    renderItem(item) {
        let duration = new Date(item.item.duration);
        let start = new Date(item.item.start);
        let breakTime = item.item.breakTime;
        let end = new Date(item.item.start + item.item.duration + ((breakTime??0)*1000*60));
        let comment = item.item.comment;
        let key = item.item.key;

        let isSelected = this.state.selectedIndex === key;
        let isHovered  = this.state.hoveredIndex  === key || isSelected;

        return (
            <TouchableWithoutFeedback
                onLongPress={this.onItemSelect.bind(this, item)}
                onPressIn={() => {
                    this.setState({hoveredIndex: isHovered ? -1 : key})
                }}
            >
                <View style={{
                    backgroundColor:    isHovered ? Colors.gray300 : Colors.transparent,
                    borderColor:        isSelected ? Colors.primary : Colors.transparent,
                    borderLeftWidth: 5,
                    paddingLeft: 15,
                    paddingRight: 20
                }}>
                    <View style={TextStyles.spacer.m} />
                    <Text style={[TextStyles.header.major, TextStyles.default]}>
                        {DateTimeWidget.toTime(duration, true)}h
                    </Text>
                    <Text style={TextStyles.default}>
                        {DateTimeWidget.toFullDateTime(start)} Uhr bis &nbsp;
                        {DateTimeWidget.isSameDate(start, end) ? DateTimeWidget.toTime(end) : DateTimeWidget.toFullDateTime(end)} Uhr
                    </Text>
                    {!breakTime     ? '' : <Text style={TextStyles.camouflage}>Zzgl. {breakTime} Minuten Pause</Text>}
                    {!comment       ? '' : <Text style={TextStyles.camouflage}>{comment}</Text>}
                    <View style={TextStyles.spacer.l} />
                </View>
            </TouchableWithoutFeedback>
        );
    }

    render() {
        return (
            <View style={[ScreenStyles.container, {paddingHorizontal: 0}]}>
                <StatusBar backgroundColor={Colors.background} style="light" />

                <FlatList
                    data={this.state.elements}
                    renderItem={this.renderItem.bind(this)}
                    style={{
                        width: '100%'
                    }}
                />

                <ActionButton
                    src={require('../assets/icons/plus.png')}
                    onPress={() => {
                        this.navigation.navigate('AddTime', {
                            onGoBack: this.refreshListing.bind((this))
                        })
                    }}
                />

            </View>
        );
    };
}