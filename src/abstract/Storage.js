import AsyncStorageNative from "@react-native-async-storage/async-storage/src/AsyncStorage.native";

const isDebug = false;

export default class Storage {

    static async store(key, value, callback = null) {
        try {
            await AsyncStorageNative.setItem(
                key,
                value
            );
            if(callback) {
                callback(true, key, value);
            }
        } catch (error) {
            if(callback) {
                callback(false, error);
            }
        }
    }

    static async retrieve(key, callback) {
        try {
            if(isDebug) console.log('retrieving for key ' + key);
            let item = await AsyncStorageNative.getItem(
                key
            );
            if(isDebug) console.log('retrieved ' + item + ' for key ' + key);
            callback(true, key, item);
        } catch (error) {
            console.error(error);
            callback(false, error);
        }
    }


}