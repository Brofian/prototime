import {StyleSheet} from "react-native";
import {Colors} from "./Variables";

export const ScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Colors.background,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: 20,
    }
});
