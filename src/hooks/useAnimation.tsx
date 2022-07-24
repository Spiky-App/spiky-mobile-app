import { useRef } from 'react';
import { Animated } from 'react-native';

export const useAnimation = () => {
    
    const opacity  = useRef( new Animated.Value(0) ).current;
    const position = useRef( new Animated.Value(0) ).current;
    const scale = useRef( new Animated.Value(1) ).current;

    const fadeIn = ( duration: number = 300, callback: () => void = () => {} ) => {
        Animated.timing(
            opacity,
            {
                toValue: 1,
                duration,
                useNativeDriver: true
            }
        ).start(callback);
    }

    const fadeOut = (duration: number = 300, callback: () => void = () => {} ) => {
        Animated.timing(
            opacity,
            {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }
        ).start(callback);
    }


    const movingPositionAndScale = ( initPosition: number, endPosition: number, initScale: number, endScale: number, duration: number = 300, callback: () => void = () => {} ) => {
        
        position.setValue(initPosition);
        scale.setValue(initScale);

        Animated.parallel([
            Animated.timing(
                position,
                {
                    toValue: endPosition,
                    duration,
                    useNativeDriver: true,
                }
            ),
            Animated.timing(
                scale,
                {
                    toValue: endScale,
                    duration,
                    useNativeDriver: true,
                }
            ),
        ]).start(callback);
    }


    return {
        opacity,
        position,
        scale,
        fadeIn,
        fadeOut,
        movingPositionAndScale
    }
}
