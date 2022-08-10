import React from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { faPlus } from '../constants/icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import IconGray from './svg/IconGray';

export const FloatButton = () => {
    const navigation = useNavigation<any>();

    return (
        <TouchableHighlight
            underlayColor="#01192ebe"
            onPress={() => navigation.navigate('CreateIdeaScreen')}
            style={stylescom.button}
        >
            {/* <FontAwesomeIcon icon={faPlus} color="" size={40} /> */}
            <View style={{ width: '100%', justifyContent: 'center', paddingRight: 8 }}>
                {/* <View style={{position:'absolute', top: 4}}>
                    <FontAwesomeIcon icon={faPlus} color="#FC702A" size={20} />
                </View>  */}
                <IconGray color="#01192E" underlayColor={'#E6E6E6'} />
            </View>
        </TouchableHighlight>
    );
};

const stylescom = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        height: 75,
        // width: 75,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#F8F8F8',
        // backgroundColor: '#01192E',
        backgroundColor: 'transparent',
        marginHorizontal: 20,
        marginVertical: 25,
        // borderWidth: 2,
        // borderColor: '#01192E',
        borderRadius: 100,
    },
});
