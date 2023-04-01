import React, { useEffect } from 'react';
import { styles } from '../themes/appTheme';
import { StyleSheet, Text, TouchableHighlight, View, Animated } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTriangleExclamation } from '../constants/icons/FontAwesome';
import { useAnimation } from '../hooks/useAnimation';

interface Props {
    callback: () => void;
}

const NetworkErrorFeed = ({ callback }: Props) => {
    const { opacity, fadeIn } = useAnimation({});

    useEffect(() => {
        fadeIn(150);
    }, []);

    return (
        <Animated.View style={{ alignItems: 'center', width: '100%', flex: 1, opacity }}>
            <View style={stylescomp.wrap}>
                <View style={stylescomp.subwrap}>
                    <View style={{ marginBottom: 6 }}>
                        <FontAwesomeIcon icon={faTriangleExclamation} color={'#707070'} size={20} />
                    </View>
                    <Text style={stylescomp.text}>Sin conexión a internet.</Text>
                    <Text style={stylescomp.text}>Revisa tu conexión.</Text>
                </View>
            </View>
            <TouchableHighlight
                underlayColor="#01192ebe"
                style={{ ...styles.button, marginTop: 20 }}
                onPress={callback}
            >
                <Text style={styles.text}>Presiona para volver a intentarlo</Text>
            </TouchableHighlight>
        </Animated.View>
    );
};

export default NetworkErrorFeed;

const stylescomp = StyleSheet.create({
    wrap: {
        width: '90%',
        marginTop: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        marginVertical: 8,
        shadowColor: '#4d4d4d',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 6,
    },
    subwrap: {
        ...styles.center,
        paddingVertical: 8,
        paddingHorizontal: 25,
        borderRadius: 8,
    },
    text: {
        ...styles.h5,
        ...styles.textGray,
        textAlign: 'center',
    },
});
