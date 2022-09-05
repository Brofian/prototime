
const msPerHour = 1000*60*60;
const msPerDay = msPerHour*24;
const msPerWeek = msPerDay*7;

const daysOfMonth = [];


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
        let jd = end.getFullYear()   - start.getFullYear();
        let md = end.getMonth()      - start.getMonth();
        return jd * 12 + md;
    }

    /**
     * @param {Date} start
     * @param {Date} end
     * @returns {int}
     */
    static timeDiffInYears(start, end) {
        return end.getFullYear() - start.getFullYear();
    }

    /**
     * @param {Date} start
     * @param {Date} end
     * @returns {int}
     */
    static timeDiffInWeeks(start, end) {
        let msd = end.getTime() - start.getTime();
        return Math.floor(msd / (7*msPerDay));
    }

    /**
     * @param {Date} date
     * @return {int}
     */
    static getWeek(date) {
        let d = new Date(date.getTime());
        d.setHours(0, 0, 0, 0);
        // Thursday in current week decides the year.
        d.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        // January 4 is always in week 1.
        let week1 = new Date(date.getFullYear(), 0, 4);
        // Adjust to Thursday in week 1 and count number of weeks from date to week1.
        return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
            - 3 + (week1.getDay() + 6) % 7) / 7);
    }

    static getDaysInMonth(date) {
        return new Date(date.getFullYear(), date.getMonth()+1, 0).getDate();
    }

    static getDaysInMonthUntil(date) {
        let daysOfMonth = TimeCalculations.getDaysInMonth(date);
        return daysOfMonth - date.getDate();
    }

    static getDaysInYearUntil(date) {
        let timeAtNewYear = new Date(date.getFullYear(), 0, 1);
        let timeDiff = date.getTime() - timeAtNewYear.getTime();

        return Math.floor(timeDiff/msPerDay);
    }

    static getDaysInYear(date) {
        return TimeCalculations.getDaysInYearUntil(
            new Date(date.getFullYear(), 12, 30)
        );
    }

}