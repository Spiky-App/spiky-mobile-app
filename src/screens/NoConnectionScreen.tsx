import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { LogoFadeIn } from '../components/common/LogoFadeIn';
import { faTriangleExclamation } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';

const NoConnectionScreen = () => {
    return (
        <BackgroundPaper>
            <View style={styles.center}>
                <View style={{ marginBottom: 10 }}>
                    <FontAwesomeIcon icon={faTriangleExclamation} color={'#01192E'} size={80} />
                </View>
                <Text style={{ ...styles.text, ...styles.h3 }}>
                    Ooops
                    <Text style={styles.orange}>!</Text>
                </Text>
                <View style={{ ...styles.center, marginTop: 10 }}>
                    <Text style={stylescomp.text}>Sin conexión a internet.</Text>
                    <Text style={stylescomp.text}>Revisa tu conexión.</Text>
                </View>
            </View>
            <LogoFadeIn />
        </BackgroundPaper>
    );
};

const stylescomp = StyleSheet.create({
    text: {
        ...styles.h5,
        ...styles.textGray,
        fontSize: 14,
    },
});

export default NoConnectionScreen;
