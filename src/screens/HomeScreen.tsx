import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { styles } from '../themes/appTheme';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { useNavigation } from '@react-navigation/native';
import { LogoFadeIn } from '../components/common/LogoFadeIn';

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
