import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { removeToast } from '../../../store/feature/toast/toastSlice';
import { useAppDispatch } from '../../../store/hooks';
import { StatusType } from '../../../types/common';

interface Props {
    message: string;
    status?: StatusType;
}

function ToastMessage({ message, status }: Props) {
    const dispatch = useAppDispatch();
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.delay(5000),
            Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]).start(() => dispatch(removeToast()));
    }, []);

    const containerStyle = () => {
        switch (status) {
            case StatusType.WARNING:
                return styles.warningContainer;
            default:
                return {};
        }
    };

    const textStyle = () => {
        switch (status) {
            case StatusType.WARNING:
                return styles.warningText;
            default:
                return {};
        }
    };

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
                containerStyle(),
            ]}
        >
            <Text style={[styles.text, textStyle()]}>{message}</Text>
        </Animated.View>
    );
}

export default ToastMessage;

const styles = StyleSheet.create({
    container: {
        borderRadius: 4,
        marginVertical: 5,
        padding: 15,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
    },
    warningContainer: {
        backgroundColor: '#ff3f3f',
    },
    text: {
        color: '#000',
        fontWeight: '600',
        fontSize: 12,
        letterSpacing: 0.26,
        marginHorizontal: 10,
    },
    warningText: {
        color: '#fff',
    },
});
