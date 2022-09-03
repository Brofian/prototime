import {StyleSheet} from "react-native";
import {Colors} from "./Variables";

export const ButtonStyles = StyleSheet.create({
    action: {
        main: {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.primary,
            borderRadius: 100000,
            aspectRatio: 1,
            overflow: 'hidden',
            position: 'absolute',
            right: 30,
            bottom: 100
        },
        icon: {
            flex: 1,
            height: undefined,
            width: undefined,
            resizeMode:'contain'
        }
    },
    primary: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: Colors.primary,
        borderRadius: 30
    },
    secondary: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: Colors.gray300,
        borderRadius: 30
    }
});