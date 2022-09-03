import {Alert} from "react-native";

export default class AlertHelper {

    static confirm(title, text, callback = null) {
        Alert.alert(
            title,
            text,
            [
                {
                    text: "Abbrechen",
                    style: "cancel",
                },
                {
                    text: "Löschen",
                    style: "confirm",
                    onPress: callback
                },
            ],
        );
    }


}