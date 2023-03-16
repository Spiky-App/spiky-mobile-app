import React from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus } from '../constants/icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

export const FloatButton = () => {
    const navigation = useNavigation<any>();

    return (
        <TouchableHighlight
            underlayColor="#FC702Abe"
            onPress={() => navigation.navigate('CreateIdeaScreen')}
            style={stylescom.button}
        >
            <FontAwesomeIcon icon={faPlus} color="#F8F8F8" size={40} />
        </TouchableHighlight>
    );
};

const stylescom = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        height: 65,
        width: 65,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#01192E',
        marginHorizontal: 15,
        marginVertical: 25,
        borderWidth: 0,
        borderRadius: 100,
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
});
