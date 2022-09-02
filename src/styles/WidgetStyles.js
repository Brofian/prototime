import {StyleSheet} from "react-native";
import {Colors} from "./Variables";

export const WidgetStyles = StyleSheet.create({
    dateTime: {
        main: {
            flexDirection: 'row',
            borderColor: Colors.primary,
            borderWidth: 2,
            borderRadius: 5,
            backgroundColor: Colors.primaryLight
        },
        left: {
            padding: 10,
            backgroundColor: Colors.primaryLight
        },
        right: {
            padding: 10,
            paddingLeft: 0,
            backgroundColor: Colors.primaryLight
        }
    },
});