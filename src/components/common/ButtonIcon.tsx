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
import { styles } from '../../themes/appTheme';

interface Props extends TouchableOpacityProps {
    icon: IconDefinition;
    iconStyle?: StyleProp<ViewStyle>;
    iconColor?: string;
}

function ButtonIcon({ disabled, icon, onPress, iconStyle, style, iconColor }: Props) {
    return (
        <TouchableOpacity
            style={[
                stylescomp.circleButton,
                { backgroundColor: disabled ? '#D4D4D4' : '#01192E' },
                styles.shadow_button,
                style,
            ]}
            onPress={onPress}
            disabled={disabled}
        >
            <View style={iconStyle}>
                <FontAwesomeIcon icon={icon} size={16} color={iconColor ? iconColor : 'white'} />
            </View>
        </TouchableOpacity>
    );
}

export default ButtonIcon;

const stylescomp = StyleSheet.create({
    circleButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 45,
        height: 45,
        // borderWidth: 1,
        borderRadius: 30,
    },
});
