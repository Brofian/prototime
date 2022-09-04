import {Component} from "react";

export class TimelessStateComponent extends Component {

    state = {};

    constructor(props) {
        super(props);
        this.stateIsReady = false;
    }

    componentDidMount() {
        this.stateIsReady = true;
    }

    setState(state, callback = null) {
        if(this.stateIsReady) {
            super.setState(state, callback);
        }
        else {
            for(let key in state) {
                if(state.hasOwnProperty(key)) {
                    this.state[key] = state[key];
                }
            }
            if(callback) {
                callback();
            }
        }
    }

}