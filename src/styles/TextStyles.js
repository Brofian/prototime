import {StyleSheet} from "react-native";
import {Colors} from "./Variables";

export const TextStyles = StyleSheet.create({
    default: {
      color: Colors.text
    },
    dark: {
      color: Colors.background
    },
    camouflage: {
      color: Colors.gray500
    },
    spacer: {
        xs: {
            height: 2
        },
        s: {
            height: 5
        },
        m: {
            height: 10
        },
        l: {
            height: 20
        },
        xl: {
            height: 40
        }
    },
    header: {
        minor: {
            width: '100%',
            fontSize: 20,
            fontWeight: "600"
        },
        major: {
            width: '100%',
            fontSize: 30,
            fontWeight: "600"
        }
    },
    bold: {
        fontWeight: "600"
    },
    centered: {
      textAlign: 'center'
    },
    hasError: {
        color: Colors.red,
        fontWeight: "600"
    },
    icon: {
        flex: 1,
        height: 16,
        width: 16,
        resizeMode:'contain',
        tintColor: Colors.text
    }
});

export const TS = TextStyles;