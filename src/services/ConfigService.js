import Storage from "../abstract/Storage";
import EventSystem from "./EventSystem";

export const AppVersion = "0.8.0";

export const configEvents = {
    configInitialized: 'configInitialized',
    configChanged: 'configChanged'
}

export const defaultConfig = {
    timeUnit: 'month',
    hoursPerUnit: 40,
    breakTime: 0,
    startOfMeasurement: (new Date('2022/09/01')).getTime(),
    backlogThreshold: 40,
    ignoredHoursInUnitBeforeStart: 0,
    trackingState: null,
    installedAppVersion: '0.0.0'
};


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

        if(fallback === null && defaultConfig[key] !== null) {
            // if no fallback is provided, but a default exists, return the default
            return defaultConfig[key];
        }
        // otherwise return the fallback
        return fallback;
    }


    set(key, value, doInstantSave = false) {
        this.configuration[key] = value;
        this._onStorageChange();
        if(doInstantSave) {
            this.save();
        }
    }

    save(callback = null) {
        Storage.store('config', JSON.stringify(this.configuration), callback);
    }

    /**
     * @internal
     * @private
     */
    _clear(callback) {
        this.configuration = {};
        this.save(callback);
    }
}
