import {StyleSheet} from "react-native";
import {Colors} from "./Variables";

export const WidgetStyles = StyleSheet.create({
    dateTime: {
        main: {
            flexDirection: 'row',
            borderColor: Colors.primary,
            borderRadius: 5,
            overflow: 'hidden'
        },
        left: {
            padding: 10,
            paddingRight: 5,
            backgroundColor: Colors.primaryLight
        },
        right: {
            padding: 10,
            paddingLeft: 5,
            backgroundColor: Colors.primaryLight
        }
    },
    textarea: {
        borderWidth: 1,
        borderColor: Colors.gray800,
        width: '100%',
        minHeight: 100,
        padding: 10,
        textAlignVertical: 'top'
    },
    button: {
        backgroundColor: Colors.primaryLight,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        overflow: 'hidden'
    }
});