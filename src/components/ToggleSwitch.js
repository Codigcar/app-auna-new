import PropTypes from "prop-types";
import React from "react";
import {
    Animated, StyleSheet,
    Text,
    TouchableOpacity, View
} from "react-native";
import { css } from '../utils/css';


export default class ToggleSwitch extends React.Component {
    static calculateDimensions(size) {
        switch (size) {
            case "small":
                return {
                    width: 40,
                    padding: 10,
                    circleWidth: 15,
                    circleHeight: 15,
                    translateX: 22
                };
            case "large":
                return {
                    width: 70,
                    padding: 20,
                    circleWidth: 30,
                    circleHeight: 30,
                    translateX: 38
                };
            default:
                return {
                    width: 46,
                    padding: 12,
                    circleWidth: 18,
                    circleHeight: 18,
                    translateX: 26
                };
        }
    }

    static propTypes = {
        isOn: PropTypes.bool.isRequired,
        label: PropTypes.string,
        labelLink: PropTypes.string,
        onTextLink: PropTypes.func,
        onColor: PropTypes.string.isRequired,
        offColor: PropTypes.string.isRequired,
        size: PropTypes.string,
        labelStyle: PropTypes.object,
        onToggle: PropTypes.func,
        icon: PropTypes.object,
        disabled: PropTypes.bool
    };

    static defaultProps = {
        isOn: false,
        onColor: '#4cd137',
        offColor: "#ecf0f1",
        size: "medium",
        labelStyle: {},
        thumbOnStyle: {},
        thumbOffStyle: {},
        trackOnStyle: {},
        trackOffStyle: {},
        icon: null,
        disabled: false
    };

    offsetX = new Animated.Value(0);
    dimensions = ToggleSwitch.calculateDimensions(this.props.size);

    createToggleSwitchStyle = () => ({
        justifyContent: "center",
        width: this.dimensions.width,
        borderRadius: 20,
        padding: this.dimensions.padding,
        backgroundColor: this.props.isOn ? this.props.onColor : this.props.offColor,
        ...(this.props.isOn ? this.props.trackOnStyle : this.props.trackOffStyle)
    });

    createInsideCircleStyle = () => ({
        alignItems: "center",
        justifyContent: "center",
        margin: 4,
        position: "absolute",
        backgroundColor: "white",
        transform: [{ translateX: this.offsetX }],
        width: this.dimensions.circleWidth,
        height: this.dimensions.circleHeight,
        borderRadius: this.dimensions.circleWidth / 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        shadowRadius: 2.5,
        elevation: 1.5,
        ...(this.props.isOn ? this.props.thumbOnStyle : this.props.thumbOffStyle)
    });

    render() {
        const { isOn, onToggle, disabled, labelStyle, label, labelLink, onTextLink, icon } = this.props;

        const toValue = isOn
            ? this.dimensions.width - this.dimensions.translateX
            : 0;

        Animated.timing(this.offsetX, {
            toValue,
            duration: 300,
            useNativeDriver: true,
        }).start();

        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={this.createToggleSwitchStyle()}
                    activeOpacity={0.8}
                    onPress={() => (disabled ? null : onToggle(!isOn))}
                >
                    <Animated.View style={this.createInsideCircleStyle()}>
                        {icon}
                    </Animated.View>
                </TouchableOpacity>
                {label ? (
                    <View style={styles.containerText}>
                        <Text style={[styles.labelStyle, labelStyle]}>
                            <Text>{label}</Text>
                            {labelLink ? (
                                <Text style={[styles.labelStyle, labelStyle, { borderWidth: 2, fontWeight: "bold" }]} onPress={() => onTextLink()} >
                                    {labelLink}
                                </Text>
                            ) : null}
                        </Text>
                    </View>
                ) : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 0,
        marginTop: 2,
        marginBottom: 2
    },
    containerText: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        paddingLeft: 5
    },
    labelStyle: {
        color: css.colors.opaque,
        fontSize: 8.5
    }
});