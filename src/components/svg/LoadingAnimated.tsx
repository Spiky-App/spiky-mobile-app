import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useAnimation } from '../../hooks/useAnimation';
import { styles } from '../../themes/appTheme';

interface Props {
    scale?: number;
}

export const LoadingAnimated = ({ scale: customScale = 1 }: Props) => {
    const { opacity, fadeIn } = useAnimation({});

    useEffect(() => {
        fadeIn(1200);
    }, []);

    return (
        <Animated.View
            style={{
                ...styles.center,
                flexDirection: 'row',
                transform: [{ scale: customScale }],
                marginVertical: 20,
                opacity,
            }}
        >
            <Dot delay={0} />
            <Dot delay={250} />
            <Dot delay={500} />
        </Animated.View>
    );
};

interface DotProps {
    delay: number;
}

const Dot = ({ delay }: DotProps) => {
    const { position, movingPositionAndBackLoop } = useAnimation({});
    const timeoutRef = useRef(0);

    useEffect(() => {
        movingPositionAndBackLoop(0, -8, 400);
        timeoutRef.current = setTimeout(() => {
            movingPositionAndBackLoop(0, -8, 400, 500);
        }, delay);

        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <Animated.View
            style={{
                backgroundColor: '#01192E',
                borderRadius: 2,
                height: 11,
                width: 11,
                marginHorizontal: 5,
                transform: [{ translateY: position }],
            }}
        />
    );
};
