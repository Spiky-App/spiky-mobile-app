import React, { useEffect } from 'react';
import { StyleSheet, Text, Animated } from 'react-native';
import { useAnimation } from '../hooks/useAnimation';

const NudgeNotice = () => {
    const { opacity, fadeInFadeOutLoop } = useAnimation();

    useEffect(() => {
        fadeInFadeOutLoop(350, () => {}, 500);
        Animated.sequence([
            Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.delay(3000),
            Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]).start(() => {});
    }, []);
    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity,
                    transform: [
                        {
                            translateY: opacity.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0],
                            }),
                        },
                    ],
                },
            ]}
        >
            <Text numberOfLines={1} style={styles.enviasteUnZumbido}>
                {'Recibiste un zumbido'}
            </Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
        backgroundColor: '#FC702A',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        shadowOffset: { width: 0, height: 0 },
        shadowColor: 'black',
        shadowOpacity: 1,
    },
    enviasteUnZumbido: {
        fontSize: 14,
        color: '#01192E',
    },
});

export default NudgeNotice;
