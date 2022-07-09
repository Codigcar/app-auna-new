import React from 'react';
import { Input } from 'react-native-elements';
import BaseTextComponent from './masks/lib/base-text-component';

export default class TextInputMask extends BaseTextComponent {
    getElement() {
        return this._inputElement
    }

    _onChangeText(text) {
        if (!this._checkText(text)) {
            return
        }

        const { maskedText, rawText } = this.updateValue(text)

        if (this.props.onChangeText) {
            this._trySetNativeProps(maskedText)
            this.props.onChangeText(maskedText, rawText)
        }
    }

    _trySetNativeProps(maskedText) {
        try {
            const element = this.getElement()
            element.setNativeProps && element.setNativeProps({ text: maskedText })
        } catch (error) {
            console.warn(error);
        }
    }

    _checkText(text) {
        if (this.props.checkText) {
            return this.props.checkText(this.props.value, text)
        }

        return true
    }

    _getKeyboardType() {
        return this.props.keyboardType || this._maskHandler.getKeyboardType()
    }

    render() {
        return (
            <Input
                ref={ref => {
                    if (ref) {
                        this._inputElement = ref

                        if (typeof this.props.refInput === 'function') {
                            this.props.refInput(ref)
                        }
                    }
                }}
                keyboardType={this._getKeyboardType()}
                {...this.props}
                onChangeText={text => this._onChangeText(text)}
                onFocus={this.props.onFocus}
                value={
                    this.getDisplayValueFor(
                        this.props.value
                    )
                }
            />
        )
    }
}
