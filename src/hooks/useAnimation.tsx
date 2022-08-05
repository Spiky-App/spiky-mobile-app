import { useRef } from 'react';
import { Animated } from 'react-native';

export const useAnimation = () => {
    const opacity = useRef(new Animated.Value(0)).current;
    const position = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;

    const fadeIn = (duration: number = 300, callback: () => void = () => {}, delay: number = 0) => {
        Animated.timing(opacity, {
            toValue: 1,
            duration,
            delay,
            useNativeDriver: true,
        }).start(callback);
    };

    const fadeOut = (
        duration: number = 300,
        callback: () => void = () => {},
        delay: number = 0
    ) => {
        Animated.timing(opacity, {
            toValue: 0,
            duration,
            delay,
            useNativeDriver: true,
        }).start(callback);
    };

    const fadeInFadeOutLoop = (
        duration: number = 300,
        callback: () => void = () => {},
        delay: number = 0
    ) => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration,
                    useNativeDriver: true,
                }),
                Animated.delay(delay),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration,
                    useNativeDriver: true,
                }),
            ])
        ).start(callback);
    };

    const movingPositionAndScale = (
        initPosition: number,
        endPosition: number,
        initScale: number,
        endScale: number,
        duration: number = 300,
        callback: () => void = () => {}
    ) => {
        position.setValue(initPosition);
        scale.setValue(initScale);

        Animated.parallel([
            Animated.timing(position, {
                toValue: endPosition,
                duration,
                useNativeDriver: true,
            }),
            Animated.timing(scale, {
                toValue: endScale,
                duration,
                useNativeDriver: true,
            }),
        ]).start(callback);
    };

    const movingPositionAndBackLoop = (
        initPosition: number,
        endPosition: number,
        duration: number = 300,
        delay: number = 300,
        callback: () => void = () => {}
    ) => {
        position.setValue(initPosition);
        Animated.loop(
            Animated.sequence([
                Animated.timing(position, {
                    toValue: endPosition,
                    duration,
                    useNativeDriver: true,
                }),
                Animated.timing(position, {
                    toValue: 0,
                    duration,
                    useNativeDriver: true,
                }),
                Animated.delay(delay),
            ])
        ).start(callback);
    };

    const movingPosition = (
        initPosition: number,
        endPosition: number,
        duration: number = 300,
        callback: () => void = () => {}
    ) => {
        position.setValue(initPosition);

        Animated.timing(position, {
            toValue: endPosition,
            duration,
            useNativeDriver: true,
        }).start(callback);
    };

    return {
        opacity,
        position,
        scale,
        fadeIn,
        fadeOut,
        fadeInFadeOutLoop,
        movingPositionAndScale,
        movingPositionAndBackLoop,
        movingPosition,
    };
};
