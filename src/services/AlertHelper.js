import {Alert} from "react-native";

export default class AlertHelper {

    static confirm(title, text, confirmText = "Bestätigen", callback = null) {
        Alert.alert(
            title,
            text,
            [
                {
                    text: "Abbrechen",
                    style: "cancel",
                },
                {
                    text: confirmText,
                    style: "confirm",
                    onPress: callback
                },
            ],
        );
    }


}