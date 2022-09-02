import AsyncStorageNative from "@react-native-async-storage/async-storage/src/AsyncStorage.native";

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
            let item = await AsyncStorageNative.getItem(
                key
            );
            callback(true, key, item);
        } catch (error) {
            callback(false, error);
        }
    }


}