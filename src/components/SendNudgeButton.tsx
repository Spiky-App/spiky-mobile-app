import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useContext } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { faBellConcierge } from '../constants/icons/FontAwesome';
import SocketContext from '../context/Socket/Context';
import { RootState } from '../store';
import { useAppSelector } from '../store/hooks';

const styles = StyleSheet.create({
    iconContainer: {
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        paddingHorizontal: 2,
        paddingVertical: 2,
        marginHorizontal: 6,
    },
});
interface Props {
    conversationId: number;
    toUser?: number;
    isOnline?: boolean;
}

const SendNudgeButton = ({ conversationId, toUser, isOnline }: Props) => {
    const { socket } = useContext(SocketContext);
    const { nickname } = useAppSelector((state: RootState) => state.user);
    async function handleSendNudge() {
        socket?.emit('sendNudge', {
            converId: conversationId,
            userto: toUser,
            nickname: nickname,
        });
    }
    const animatedValue = new Animated.Value(0);
    const buttonScale = animatedValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.25, 1.5],
    });
    const spin = animatedValue.interpolate({
        inputRange: [0, 1, 1.5],
        outputRange: ['0deg', '30deg', '-30deg'],
    });

    const onPress = () => {
        Animated.sequence([
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => handleSendNudge());
    };
    const animatedStyle = {
        transform: [{ scale: buttonScale }, { rotate: spin }],
    };

    return (
        <Animated.View style={[styles.iconContainer, animatedStyle]}>
            <TouchableOpacity onPress={onPress} disabled={!isOnline}>
                <FontAwesomeIcon
                    icon={faBellConcierge}
                    color={isOnline ? '#E6E6E6' : '#01192E'}
                    size={18}
                />
            </TouchableOpacity>
        </Animated.View>
    );
};

export default SendNudgeButton;
