import Storage from "../abstract/Storage";
import EventSystem from "./EventSystem";

const isDebug = false;

export const protocolEvents = {
    protocolInitialized: 'protocolInitialized',
    protocolChanged: 'protocolChanged',
}

export default class ProtocolService {

    static instance = null;

    /**
     * @returns {ProtocolService}
     */
    static getInstance() {
        if (ProtocolService.instance === null) {
            ProtocolService.instance = new ProtocolService();
        }
        return ProtocolService.instance;
    }


    constructor() {
        this.protocolStorage = new ProtocolStorage(this.onStorageInitialized.bind(this));

        this.entryCache = {};
    }

    onStorageChange() {
        this.entryCache = null;
        EventSystem.publish(protocolEvents.protocolChanged);
    }

    onStorageInitialized() {
        this.entryCache = null;
        EventSystem.publish(protocolEvents.protocolInitialized);
    }

    isReady() {
        return this.protocolStorage.isReady();
    }

    /**
     * @param {int} startTime
     * @param {int} duration
     * @param {string|null} comment
     * @param {int} breakTime
     */
    createEntry(startTime, duration, comment = null, breakTime = 0) {
        let entry = {
            start: startTime,
            duration: duration,
            comment: comment,
            breakTime: breakTime
        };
        this.protocolStorage.add(entry);
        this.entryCache = null;
        this.onStorageChange();
    }

    updateEntry(key, startTime, duration, comment = null, breakTime = 0) {
        let entry = {
            start: startTime,
            duration: duration,
            comment: comment,
            breakTime: breakTime
        };
        this.protocolStorage.set(entry, key.substring(5), true);
        this.entryCache = null;
        this.onStorageChange();
    }

    deleteEntry(key, callback = null) {
        this.protocolStorage.set(null, key.substring(5), true);
        this.entryCache = null;
        this.onStorageChange();
    }

    /**
     * @returns {Object}
     */
    getEntries() {
        let entries = [];

        if (this.entryCache) {
            return this.entryCache;
        }

        let datasets = this.protocolStorage.getData();
        for (let key in datasets) {
            if (datasets.hasOwnProperty(key) && datasets[key]) {
                entries.push({
                    start: datasets[key].start,
                    duration: datasets[key].duration,
                    comment: datasets[key].comment,
                    breakTime: datasets[key].breakTime,
                    key: key // required for flatList component
                });
            }
        }

        entries.sort((a,b) => {
            return a.start > b.start ? -1 : 1;
        });

        this.entryCache = entries;

        return entries;
    }

    _clear() {
        this.protocolStorage._clear();
        this.entryCache = null;
    }

}

class ProtocolStorage {

    static storage = {};

    constructor(initCallback) {
        this.isInitialized = false;
        this.initCallback = initCallback;
        this.desiredLength = 0;
        this.length = 0;
        this.debugLog('constructor', 'now retrieving length');
        this._reload();
    }

    _reload() {
        Storage.retrieve('length', this._load.bind(this));
    }

    _save() {
        this.debugLog('_save', 'now storing length '+Object.keys(ProtocolStorage.storage).length);

        Storage.store('length', ''+Object.keys(ProtocolStorage.storage).length);

        this.debugLog('_save', 'now storing items');
        let c = 0;
        for (let key in ProtocolStorage.storage) {
            Storage.store('item_' + c, JSON.stringify(ProtocolStorage.storage[key]));
            c++;
        }
        this.debugLog('_save', 'stored '+c+' items');
    }

    _clear() {
        for(let key in ProtocolStorage.storage) {
            Storage.remove('item_'+key);
        }

        ProtocolStorage.storage = [];
        this._save();
    }

    _load(success, key, item) {

        if(success && key === 'length' && (!item || item === "0")) {
            console.log('no protocol found');
            // tried loading length, but there is no entry yet
            ProtocolStorage.storage = {};
            this.desiredLength = 0;
            this.isInitialized = true;
            this.initCallback();
        }
        else if (success && item) {
            if (key === 'length') {
                ProtocolStorage.storage = {};
                this.desiredLength = parseInt(item??"0");
                this.debugLog('_load', 'loaded length of ' + this.desiredLength + '. Now retrieving items');
                for (let i = 0; i < this.desiredLength; i++) {
                    Storage.retrieve('item_' + i, this._load.bind(this));
                }
                this.debugLog('_load', 'finished requesting items');
            } else {
                ProtocolStorage.storage[key] = JSON.parse(item);
                this.length++;
                this.debugLog('_load', 'loaded item '+key+' as number '+this.length);
                if (!this.isInitialized && this.length >= this.desiredLength) {
                    this.isInitialized = true;
                    this.initCallback();
                    this.debugLog('_load', 'all request items loaded');
                }
            }
        }
        else {
            console.error(key);
        }
    }

    add(obj) {
        this.debugLog('add', 'now adding ' + JSON.stringify(obj) + ' as ' + 'item_' + this.length);
        ProtocolStorage.storage['item_' + this.length] = obj;
        this.length++;
        this._save();
    }

    set(obj, id, onlyIfExists = false) {
        if (id >= 0 && id < this.length) {
            this.debugLog('set', 'setting ' + JSON.stringify(obj) + ' as ' + 'item_' + id);
            ProtocolStorage.storage['item_' + id] = obj;
            this._save();
            return id;
        } else if(onlyIfExists) {
            this.add(obj);
            return this.length;
        }
        else {
            this.debugLog('set', 'skipping item_' + id + ', as it does not exist');

        }
    }

    delete(id, callback = null) {
        Storage.remove(id, callback);
    }

    getLoadingProgress() {
        return Math.max(1, this.length / (this.desiredLength ?? 1));
    }

    isReady() {
        return this.isInitialized;
    }

    getData() {
        return {...ProtocolStorage.storage};
    }

    debugLog(method, text) {
        if(isDebug) {
            console.log(`[Protocol] ${method}: ${text}`);
        }
    }

}