import {Component} from "react";
import {TableLayoutStyles} from "../../styles/TableLayoutStyles";
import {View} from "react-native";
import PropTypes from 'prop-types';

export class Layout extends Component {
    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', alignContent: this.props.vAlign}}>
                {this.props.children}
            </View>
        );
    }
}

Layout.propTypes = {
    vAlign: PropTypes.oneOf(['flex-start','flex-end','center']),
    children: PropTypes.node.isRequired
};
Layout.defaultProps = {
    vAlign: 'flex-start'
};


export class Row extends Component {
    render() {
        return (
            <View style={TableLayoutStyles.row}>
                {this.props.children}
            </View>
        );
    }
}

Row.propTypes = {
    children: PropTypes.node.isRequired
};

export class Column extends Component {
    render() {
        return (
            <View style={{
                flex: this.props.size,
                alignItems: this.props.vAlign,
                justifyContent: this.props.hAlign
            }}>
                {this.props.children}
            </View>
        );
    }
}

Column.propTypes = {
    size: PropTypes.number.isRequired,
    vAlign: PropTypes.oneOf(['flex-start','flex-end','center']),
    hAlign: PropTypes.oneOf(['flex-start','flex-end','center']),
    children: PropTypes.node.isRequired
};
Column.defaultProps = {
    size: 1,
    vAlign: 'flex-start',
    hAlign: 'flex-start'
};
