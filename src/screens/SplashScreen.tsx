import React from 'react';
import { Text, View } from 'react-native';
import { BackgroundPaper } from '../components/BackgroundPaper';
import IconLogoAnimated from '../components/svg/IconLogoAnimated';
import { styles } from '../themes/appTheme';

const SplashScreen = () => {
    return (
        <BackgroundPaper>
            <View style={{ ...styles.center }}>
                <IconLogoAnimated />
                <View style={{ ...styles.center }}>
                    <Text
                        style={{
                            ...styles.text,
                            ...styles.h3,
                            fontSize: 20,
                            position: 'absolute',
                            top: -30,
                        }}
                    >
                        Cargando...
                    </Text>
                </View>
            </View>
        </BackgroundPaper>
    );
};

export default SplashScreen;
