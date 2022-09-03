import Counter from "react-native-counters";

export default class FixedCounter extends Counter {

    static lastStart = null;
    static getDerivedStateFromProps(nextProps) {
        if(FixedCounter.lastStart === nextProps.start) {
            return {};
        }
        FixedCounter.lastStart = nextProps.start
        return { count: nextProps.start }
    }

}