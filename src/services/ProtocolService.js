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
        this.protocolStorage = new ProtocolStorage();

        this.entryCache = {};
        this.isEntryCacheUpToDate = false;
        this.durationCache = 0;
        this.isDurationCacheUpToDate = false;
    }

    /**
     *
     * @param {Date} startDate
     * @param {int} duration
     * @param {string|null} comment
     */
    createEntry(startDate, duration, comment = null) {
        let entry = {
            start: startDate.getTime(),
            duration: duration,
            comment: comment
        };
        this.protocolStorage.add(entry);
        this.isEntryCacheUpToDate = false;
        this.isDurationCacheUpToDate = false;
    }

    /**
     * @param {Date} startDate
     * @param {Date} endDate
     * @returns {number}
     */
    static getDuration(startDate, endDate) {
        return (endDate.getTime() - startDate.getTime());
    }

    /**
     * @param {Date} startDate
     * @param {int} duration
     */
    static getEndDate(startDate, duration) {
        return new Date(startDate.getTime() + duration);
    }

    /**
     * @returns {Object}
     */
    getEntries() {
        let entries = {};

        if (this.isEntryCacheUpToDate) {
            return this.entryCache;
        }

        let datasets = this.protocolStorage.getData();
        for (let key in datasets) {
            if (datasets.hasOwnProperty(key)) {
                entries[key] = {
                    start: new Date(datasets[key].start),
                    duration: datasets[key].duration,
                    comment: datasets[key].comment
                };
            }
        }

        this.entryCache = entries;
        this.isEntryCacheUpToDate = true;

        return entries;
    }

    /**
     * @returns {number}
     */
    getTotalDuration() {
        if (this.isDurationCacheUpToDate) {
            return this.durationCache;
        }

        let duration = this.getEntries().reduce((accumulator, object) => {
            return accumulator + object.duration;
        }, 0);

        this.durationCache = duration;
        this.isDurationCacheUpToDate = true;
        return duration;
    }

}

class ProtocolStorage {

    constructor() {
        this.storage = {};
        this.isInitialized = false;
        this.desiredLength = 0;
        this.length = 0;
        Storage.retrieve('length', this._load.bind(this));
    }

    _save() {
        Storage.store('length', Object.keys(this.storage).length);
        let c = 0;
        for (let item of this.storage) {
            Storage.store('item_' + c, JSON.stringify(item));
            c++;
        }
    }

    _load(success, key, item) {
        if (success) {
            if (key === 'length') {
                this.desiredLength = parseInt(item);
                for (let i = 0; i < this.length; i++) {
                    Storage.retrieve('item_' + i, this._load.bind(this));
                }
            } else {
                this.storage[key] = JSON.parse(item);
                this.length++;
                if (this.length >= this.desiredLength) {
                    this.isInitialized = true;
                }
            }
        }
    }

    add(obj) {
        this.storage['item_' + this.length] = obj;
        this.length++;
    }

    set(obj, id) {
        if (id >= 0 && id < this.length) {
            this.storage['item_' + id] = obj;
            return id;
        } else {
            this._add(obj);
            return this.length;
        }
    }

    getLoadingProgress() {
        return Math.max(1, this.length / this.desiredLength);
    }

    getData() {
        return this.storage;
    }


}