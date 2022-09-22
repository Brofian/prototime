import {LogBox, View} from 'react-native';
import ProtocolService from "../services/ProtocolService";
import {Colors} from "../styles/Variables";
import AddTimeScreen from "./AddTimeScreen";
import ActionButton from "../components/ActionButton";
import AlertHelper from "../services/AlertHelper";
import ImageService from "../services/ImageService";
import {TextStyles} from "../styles/TextStyles";


LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

export default class EditTimeScreen extends AddTimeScreen {

    constructor(props) {
        super(props);
        this.title = 'Bearbeite den Eintrag';
    }


    onDelete() {
        try {
            ProtocolService.getInstance().deleteEntry(this.route.params.item.key);
            this.route.params.onGoBack();
            this.navigation.goBack(null);
        }
        catch (err) {
            this.setState({
               error: err.toString()
            });
        }
    }

    onSave() {
        let duration = this.state.end - this.state.start - (this.state.break*1000*60);
        if(duration < (1000*60*5)) {
            this.setState({
                error: 'Der Zeitraum muss über 5 Minuten liegen!'
            });
            return;
        }

        try {
            ProtocolService.getInstance().updateEntry(
                this.route.params.item.key,
                this.state.start,
                duration,
                this.state.comment,
                this.state.break
            );

            this.setState({
                error: ''
            });
        }
        catch (err) {
            this.setState({
                error: err.toString()
            });
            return;
        }

        this.route.params.onGoBack();
        this.navigation.goBack(null);
    }

    getCurrentStart() {
        return this.state.start;
    }

    render() {
        return (
            <View style={{flex: 1}}>
                {super.render()}

                <ActionButton
                    color={Colors.red}
                    background={Colors.warning}
                    iconTint={Colors.text}
                    src={ImageService.getInstance().getIcon('bin')}
                    onPress={
                        () => AlertHelper.confirm(
                            'Wirklich löschen?',
                            'Wenn du das tust, geht der Eintrag unwiederruflich verloren. Bist du dir sicher, dass du löschen möchtest?',
                            'Bestätigen',
                            () => {
                                AlertHelper.confirm(
                                    'Bist du sicher?',
                                    'Das ist meine letzte Warnung. Er wird für immer weg sein!',
                                    'Ich bin sicher!',
                                    this.onDelete.bind(this)
                                );
                            }
                        )
                    }
                />

            </View>
        );
    }

}
