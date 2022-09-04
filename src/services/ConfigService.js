import Storage from "../abstract/Storage";
import EventSystem from "./EventSystem";

export const configEvents = {
    configInitialized: 'configInitialized',
    configChanged: 'configChanged'
}

export default class ConfigService {

    static instance = null;

    /**
     * @returns {ConfigService}
     */
    static getInstance() {
        if (ConfigService.instance === null) {
            ConfigService.instance = new ConfigService();
        }
        return ConfigService.instance;
    }

    constructor() {
        this.configuration = {};
        this.isInitialized = false;
        Storage.retrieve('config', this._onReloadConfig.bind(this));
    }

    /**
     * @internal
     * @private
     */
    _onStorageChange() {
        EventSystem.publish(configEvents.configChanged);
    }

    isReady() {
        return this.isInitialized;
    }

    /**
     * @internal
     * @private
     */
    _onReloadConfig(success, key, item)
    {
        if(success) {
            this.configuration = JSON.parse(item??'{}');
            this.isInitialized = true;
            EventSystem.publish(configEvents.configInitialized);
        }
    }

    get(key, fallback = null) {
        if(this.configuration.hasOwnProperty(key)) {
            return this.configuration[key];
        }
        return fallback;
    }


    set(key, value) {
        this.configuration[key] = value;
        this._onStorageChange();
    }

    save() {
        Storage.store('config', JSON.stringify(this.configuration));
    }
}
