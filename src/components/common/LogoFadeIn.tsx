import React, { useEffect } from 'react';
import { Animated, View } from 'react-native';
import { useAnimation } from '../../hooks/useAnimation';
import LogoSvg from '../svg/LogoSvg';

export const LogoFadeIn = () => {
    const { opacity, fadeIn } = useAnimation({});

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
            <Animated.View style={{ width: 100, opacity }}>
                <LogoSvg />
            </Animated.View>
        </View>
    );
};
