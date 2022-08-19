import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface Props extends TouchableOpacityProps {
    icon: IconDefinition;
}

function ButtonIcon({ disabled, icon, onPress }: Props) {
    return (
        <TouchableOpacity
            style={[styles.circleButton, { borderColor: disabled ? '#d4d4d4d3' : '#01192E' }]}
            onPress={onPress}
            disabled={disabled}
        >
            <FontAwesomeIcon icon={icon} size={16} color={disabled ? '#d4d4d4d3' : '#01192E'} />
        </TouchableOpacity>
    );
}

export default ButtonIcon;

const styles = StyleSheet.create({
    circleButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 45,
        height: 45,
        borderWidth: 1,
        borderRadius: 30,
    },
});
