export default class TimeCalculations {

    /**
     * @param {number} minutes
     * @returns {string}
     */
    static formatMinutes(minutes) {
        'worklet';

        let h = Math.abs(Math.floor(minutes/60));
        if(h < 10) {
            h = '0'+h;
        }

        let m = Math.abs(Math.floor(minutes%60));
        if(m < 10) {
            m = '0'+m;
        }

        return `${minutes<0?'-':''}${h}:${m}`;
    }

    /**
     * @param {Date} start
     * @param {Date} end
     * @returns {int}
     */
    static timeDiffInMonths(start, end) {
        let jd = end.getUTCFullYear()   - start.getUTCFullYear();
        let md = end.getUTCMonth()      - start.getUTCMonth();
        return jd * 12 + md;
    }

}