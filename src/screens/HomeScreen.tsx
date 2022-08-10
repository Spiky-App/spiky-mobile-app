import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { styles } from '../themes/appTheme';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { useNavigation } from '@react-navigation/native';
import LogoSvg from '../components/svg/LogoSvg';
import { useAnimation } from '../hooks/useAnimation';

export const HomeScreen = () => {
    const navigation = useNavigation<any>();

    return (
        <BackgroundPaper>
            <View style={stylecom.container}>
                <Text style={{ ...styles.text, ...styles.h1 }}>Es</Text>

                <Text style={{ ...styles.text, ...styles.h1 }}>tiempo</Text>

                <Text style={{ ...styles.text, ...styles.h1 }}>
                    de hablar
                    <Text style={styles.orange}>.</Text>
                </Text>
            </View>

            <View style={stylecom.wrapContainer}>
                <TouchableHighlight
                    underlayColor="#01192ebe"
                    onPress={() => navigation.navigate('LoginScreen')}
                    style={styles.button}
                >
                    <Text style={{ ...styles.text, ...styles.textb }}>Soy miembro</Text>
                </TouchableHighlight>

                <TouchableHighlight
                    underlayColor="#01192ebe"
                    onPress={() => navigation.navigate('ManifestPart1Screen')}
                    style={styles.button}
                >
                    <Text style={{ ...styles.text, ...styles.textb }}>Soy nuevo</Text>
                </TouchableHighlight>
            </View>
            <LogoFadeIn />
        </BackgroundPaper>
    );
};

const LogoFadeIn = () => {
    const { opacity, fadeIn } = useAnimation();

    useEffect(() => {
        fadeIn(800, () => {}, 1000);
    }, []);

    return (
        <View
            style={{
                position: 'absolute',
                bottom: 40,
                left: 0,
                right: 0,
                alignItems: 'center',
            }}
        >
            <Animated.View style={{ width: 115, opacity }}>
                <LogoSvg />
            </Animated.View>
        </View>
    );
};

const stylecom = StyleSheet.create({
    wrapContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: 30,
        width: '100%',
    },
    logo: {
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    container: {
        justifyContent: 'center',
        marginHorizontal: 20,
    },
});
