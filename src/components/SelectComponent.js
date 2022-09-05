import {TimelessStateComponent} from "../abstract/Component";
import SelectDropdown from 'react-native-select-dropdown';
import {Text, View} from "react-native";
import {ButtonStyles} from "../styles/ButtonStyles";
import {Colors} from "../styles/Variables";


export default class SelectComponent extends TimelessStateComponent {

    onChange(selectedItem, index) {
        if(this.props.onChange) {
            this.props.onChange(selectedItem);
        }
    }

    render() {
        return (
            <View style={{overflow: 'hidden'}}>
                <SelectDropdown
                    data={this.props.data}
                    onSelect={this.onChange.bind(this)}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem.value;
                    }}
                    rowTextForSelection={(item, index) => {
                        return item.value;
                    }}
                    defaultValue={this.props.default}
                    //renderCustomizedButtonChild={this.renderButton}
                    dropdownStyle={{
                        backgroundColor: Colors.white,
                    }}
                    buttonStyle={{
                        backgroundColor: Colors.transparent,
                        //paddingHorizontal: 25
                        width: 153
                    }}
                    buttonTextStyle={ButtonStyles.config}
                />
            </View>
        );
    }

}