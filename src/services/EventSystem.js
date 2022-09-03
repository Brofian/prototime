import {NativeEventEmitter} from "react-native";

export default class EventSystem {

    static emitter = null;

    /**
     * @returns {NativeEventEmitter}
     */
    static __getEmitter() {
        if (EventSystem.emitter === null) {
            EventSystem.emitter = new NativeEventEmitter();
        }
        return EventSystem.emitter;
    }

    static publish(key, data = {}) {
        EventSystem.__getEmitter().emit(key, data);
    }

    static subscribe(key, callback, context = null) {
        EventSystem.__getEmitter().addListener(key, callback, context);
    }
}
