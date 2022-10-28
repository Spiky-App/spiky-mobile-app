import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    ViewStyle,
} from 'react-native';

interface Props extends TouchableOpacityProps {
    icon: IconDefinition;
    iconStyle?: StyleProp<ViewStyle>;
}

function ButtonIcon({ disabled, icon, onPress, iconStyle, style }: Props) {
    return (
        <TouchableOpacity
            style={[
                styles.circleButton,
                { backgroundColor: disabled ? '#d4d4d4d3' : '#01192E' },
                style,
            ]}
            onPress={onPress}
            disabled={disabled}
        >
            <View style={iconStyle}>
                <FontAwesomeIcon icon={icon} size={16} color={disabled ? 'white' : 'white'} />
            </View>
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
        // borderWidth: 1,
        borderRadius: 30,
    },
});
