import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck } from '../constants/icons/FontAwesome';

interface Props {
    checked: boolean;
}

export const CheckBox = ({ checked }: Props) => {
    return (
        <View style={checked ? stylescom.checkboxActive : stylescom.checkbox}>
            <FontAwesomeIcon icon={faCheck} color="white" size={10} />
        </View>
    );
};

const stylescom = StyleSheet.create({
    checkbox: {
        borderColor: '#01192E',
        borderWidth: 1,
        borderRadius: 2,
        width: 15,
        height: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    checkboxActive: {
        borderColor: '#01192E',
        borderWidth: 1,
        borderRadius: 2,
        width: 15,
        height: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#01192E',
    },
});
