import Storage from "../abstract/Storage";
import EventSystem from "./EventSystem";

export default class ConfigService {

    static instance = null;

    /**
     * @returns {ProtocolService}
     */
    static getInstance() {
        if (ConfigService.instance === null) {
            ConfigService.instance = new ConfigService();
        }
        return ConfigService.instance;
    }

    constructor() {
        this.configuration = {};
        Storage.retrieve('config', this._onReloadConfig.bind(this));
    }

    /**
     * @internal
     * @private
     */
    _onStorageChange() {
        EventSystem.publish('configChanged');
    }

    /**
     * @internal
     * @private
     */
    _onReloadConfig(success, key, item)
    {
        if(success) {
            this.configuration = JSON.parse(item??'{}');
            this._onStorageChange();
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
        // save
        Storage.store('config', JSON.stringify(this.configuration));
    }
}
