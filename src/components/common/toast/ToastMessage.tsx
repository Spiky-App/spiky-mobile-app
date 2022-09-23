import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { removeToast } from '../../../store/feature/toast/toastSlice';
import { useAppDispatch } from '../../../store/hooks';
import { StatusType } from '../../../types/common';
import { faTriangleExclamation, faXmark, faBell } from '../../../constants/icons/FontAwesome';
import { styles } from '../../../themes/appTheme';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
                return stylescom.warningContainer;
            case StatusType.NOTIFICATION:
                return stylescom.notificationContainer;
            default:
                return {};
        }
    };

    const iconColor = () => {
        switch (status) {
            case StatusType.WARNING:
                return '#FC702A';
            case StatusType.NOTIFICATION:
                return '#FC702A';
            default:
                return '#01192E';
        }
    };
    const icon = () => {
        switch (status) {
            case StatusType.WARNING:
                return faTriangleExclamation;
            case StatusType.NOTIFICATION:
                return faBell;
            default:
                return faTriangleExclamation;
        }
    };

    return (
        <>
            <Animated.View
                style={[
                    stylescom.container,
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
                <FontAwesomeIcon icon={icon()} color={iconColor()} size={20} />
                <Text style={[stylescom.text]}>{message}</Text>
                <View style={stylescom.xmark}>
                    <TouchableOpacity
                        onPress={() =>
                            Animated.timing(opacity, {
                                toValue: 0,
                                duration: 500,
                                useNativeDriver: true,
                            }).start()
                        }
                    >
                        <FontAwesomeIcon icon={faXmark} color={'#bebebe'} size={18} />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </>
    );
}

export default ToastMessage;

const stylescom = StyleSheet.create({
    container: {
        borderRadius: 6,
        marginVertical: 6,
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
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    warningContainer: {},
    notificationContainer: {},
    text: {
        ...styles.text,
        fontSize: 13,
        letterSpacing: 0.26,
        marginHorizontal: 10,
        marginLeft: 10,
    },
    xmark: {
        position: 'absolute',
        justifyContent: 'center',
        top: 0,
        bottom: 0,
        right: 12,
    },
});
