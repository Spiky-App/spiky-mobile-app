import React, { useContext } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Svg, { Rect, Path, G, Circle } from 'react-native-svg';
import SocketContext from '../context/Socket/Context';

const styles = StyleSheet.create({
    iconContainer: {
        height: 50,
        width: 70,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
});
interface Props {
    conversationId: number;
    toUser?: number;
}

const SendNudgeButton = ({ conversationId, toUser }: Props) => {
    const { socket } = useContext(SocketContext);
    async function handleSendNudge() {
        console.log('Nudge sent');
        socket?.emit('sendNudge', {
            converId: conversationId,
            userto: toUser,
        });
    }
    // This value is used for inputRange
    // Initial value set to 0, which maps to scale 1 in the following buttonScale
    // that means the initially the button is not scaled.
    const animatedValue = new Animated.Value(0);

    // This will be used for scale transform style in Animated.View
    // 0, 0.5 and 1 are animatedValue over a period of time specificed by duration.
    // 1, 1.25 and 1.5 are the scale value for the component at each inputRange values.
    // 0 mapes to 1, 0.5 maps to 1.25, and 1 maps to 1.5
    const buttonColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgb(90,210,244)', 'rgb(224,82,99)'],
    });

    // When button is pressed in, animate the animatedValue
    // to 1 in 250 milliseconds.
    const onPress = () => {
        Animated.sequence([
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ]).start(() => {
            handleSendNudge();
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 200,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ]).start();
        });
    };
    const animatedStyle = {
        backgroundColor: buttonColor,
    };

    return (
        <TouchableWithoutFeedback onPressIn={onPress}>
            <Animated.View style={[styles.iconContainer, animatedStyle]}>
                <Svg height="90%" width="90%" viewBox="0 0 250 200">
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
        </TouchableWithoutFeedback>
    );
};

export default SendNudgeButton;
