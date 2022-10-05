import React, { useContext } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Rect, Path, G, Circle } from 'react-native-svg';
import SocketContext from '../context/Socket/Context';
import { RootState } from '../store';
import { useAppSelector } from '../store/hooks';

const styles = StyleSheet.create({
    iconContainer: {
        height: 50,
        width: 70,
        alignItems: 'center',
        justifyContent: 'center',
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
        transform: [{ scale: buttonScale }],
    };

    return (
        <TouchableOpacity onPressIn={onPress} disabled={!isOnline}>
            <Animated.View style={[styles.iconContainer, animatedStyle]}>
                <Svg height="90%" width="90%" viewBox="0 0 250 200" opacity={isOnline ? 1 : 0.3}>
                    <G data-name="Grupo 293" transform="rotate(-22 -260.916 2657.335)">
                        <Path
                            data-name="Trazado 307"
                            d="M960.488 474.859a4 4 0 0 1-2.944-6.613l100.098-115.937a4 4 0 0 1 6.68.988l53.038 119.126a4 4 0 0 1-3.735 5.625Z"
                            fill="#01192e"
                        />
                        <Rect
                            data-name="Rect\xE1ngulo 370"
                            width={31.252}
                            height={13.331}
                            rx={2}
                            transform="rotate(-58 888.022 -805.42)"
                            fill="#01192e"
                        />
                        <G
                            data-name="Elipse 59"
                            transform="translate(988.084 447.584)"
                            fill="none"
                            stroke="#01192e"
                            strokeWidth={16}
                        >
                            <Circle cx={30} cy={30} r={30} stroke="none" />
                            <Circle cx={30} cy={30} r={22} />
                        </G>
                        <Path
                            data-name="Trazado 306"
                            d="m1123.771 392.323 22.505-12.076a2 2 0 0 1 2.674.922l4.087 8.388a2 2 0 0 1-.922 2.674l-24.5 11.937a2 2 0 0 1-2.674-.922l-4.087-8.389c-.482-.989 1.924-2.05 2.917-2.534Z"
                            fill="#01192e"
                        />
                        <Rect
                            data-name="Rect\xE1ngulo 372"
                            width={31.252}
                            height={13.331}
                            rx={2}
                            transform="rotate(8 -2443.867 8263.878)"
                            fill="#01192e"
                        />
                    </G>
                </Svg>
            </Animated.View>
        </TouchableOpacity>
    );
};

export default SendNudgeButton;
