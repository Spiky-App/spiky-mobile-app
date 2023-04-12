import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacityProps } from 'react-native';
import { faMessage } from '../../constants/icons/FontAwesome';
import { styles } from '../../themes/appTheme';

interface Props extends TouchableOpacityProps {
    callback?: () => void;
    totalComments: number;
}

export function CommentsButton({ callback, totalComments }: Props) {
    return (
        <>
            <Pressable style={styles.button_container} onPress={callback}>
                <FontAwesomeIcon icon={faMessage} color={'#67737D'} size={14} />
                <Text style={{ ...stylescomp.number, marginLeft: 4 }}>{`${totalComments}`}</Text>
            </Pressable>
        </>
    );
}

const stylescomp = StyleSheet.create({
    number: {
        ...styles.text,
        fontSize: 12,
        color: '#67737D',
        marginLeft: 1,
    },
});
