import React from 'react';
import { TouchableOpacity, View, TextInput, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { TextInputProps } from 'react-native';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { TouchableOpacityProps } from 'react-native';
import { HelperMessage, HelperMessageType } from '../../types/common';
import StylesComponent from '../../themes/components/common/textInput';

interface Props extends TextInputProps {
    helperMessage?: HelperMessage;
    icon?: IconDefinition;
    touchableOpacityProps?: TouchableOpacityProps;
}

function TextInputCustom(props: Props) {
    const { helperMessage, icon, touchableOpacityProps } = props;
    const getTextStyle = () => {
        if (helperMessage?.type === HelperMessageType.WARNING) {
            return StylesComponent.textError;
        }
        return StylesComponent.text;
    };
    const getTextInputContainerStyle = () => {
        if (helperMessage?.type === HelperMessageType.WARNING) {
            return StylesComponent.textInputContainerError;
        }
    };
    const textStyle = getTextStyle();
    const textInputContainerSyle = getTextInputContainerStyle();
    return (
        <View>
            <View style={{ ...StylesComponent.textInputContainer, ...textInputContainerSyle }}>
                <TextInput
                    {...props}
                    placeholderTextColor="#707070"
                    style={StylesComponent.textInput}
                />
                {icon && (
                    <TouchableOpacity {...touchableOpacityProps}>
                        <FontAwesomeIcon icon={icon} size={27} color="#d4d4d4" />
                    </TouchableOpacity>
                )}
            </View>
            {helperMessage && (
                <Text style={{ ...StylesComponent.text, ...textStyle }}>
                    {helperMessage.message}
                </Text>
            )}
        </View>
    );
}

export default TextInputCustom;
