import ProtocolService from "./ProtocolService";
import ConfigService from "./ConfigService";
import {defaultConfig} from "../services/ConfigService";

export default class DebugHelper {

    static createExampleEntry() {

        const comments = [
            'Konferenz und Besprechung mit Kunde',
            'Programmierung in Tickets',
            'Teilnahme an Übungskursen internen Besprechungen',
            'Einrichten von neuen Entwicklungsumgebungen',
            'Aushilfe bei Azubis',
        ];

        const msMonth = 1000*60*60*24*30;
        const workday = 1000*60*60*8;
        const min = 1000*60*10;


        let beginning = new Date(ConfigService.getInstance().get('startOfMeasurement', defaultConfig.startOfMeasurement));
        let timeSinceBeginning = (new Date()).getTime() - beginning.getTime();
        let start = beginning.getTime() + (Math.random()*timeSinceBeginning) - (min+workday);
        let duration = min + Math.random()*workday;
        let breaktime = (Math.random() > 0.5) ? 0 : 15+(Math.random() * 60);
        let comment = (Math.random() > 0.7) ? 0 : comments[Math.floor(Math.random()*comments.length)];


        ProtocolService.getInstance().createEntry(
            DebugHelper.timeRound(start),
            DebugHelper.timeRound(duration),
            comment,
            Math.floor(breaktime)
        );

    }

    static timeRound(time) {
        return Math.floor(time/60000)*60000
    }

}