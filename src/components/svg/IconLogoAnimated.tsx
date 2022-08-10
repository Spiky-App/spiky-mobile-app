import * as React from 'react';
import { Animated, View } from 'react-native';
import Svg, { SvgProps, G, Path, Rect, Circle } from 'react-native-svg';
import { useAnimation } from '../../hooks/useAnimation';

const IconLogoAnimated = (props: SvgProps) => {
    let AnimatedRect = Animated.createAnimatedComponent(Rect);
    let AnimatedPath = Animated.createAnimatedComponent(Path);
    const { opacity, fadeInFadeOutLoop } = useAnimation();

    React.useEffect(() => {
        fadeInFadeOutLoop(350, () => {}, 500);
    }, []);

    return (
        <View
            style={{
                transform: [{ scale: 0.6 }],
            }}
        >
            <Svg
                // xmlns="http://www.w3.org/2000/svg"
                width={220.944}
                height={223.442}
                {...props}
            >
                <G data-name="Grupo 293" transform="rotate(-22 -260.916 2657.335)">
                    <Path
                        data-name="Trazado 307"
                        d="M960.488 474.859a4 4 0 0 1-2.944-6.613l100.098-115.937a4 4 0 0 1 6.68.988l53.038 119.126a4 4 0 0 1-3.735 5.625Z"
                        fill="#01192e"
                    />
                    <AnimatedRect
                        data-name="Rect\xE1ngulo 370"
                        width={31.252}
                        height={13.331}
                        rx={2}
                        transform="rotate(-58 888.022 -805.42)"
                        fill="#FC702A"
                        opacity={opacity}
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
                    <AnimatedPath
                        data-name="Trazado 306"
                        d="m1123.771 392.323 22.505-12.076a2 2 0 0 1 2.674.922l4.087 8.388a2 2 0 0 1-.922 2.674l-24.5 11.937a2 2 0 0 1-2.674-.922l-4.087-8.389c-.482-.989 1.924-2.05 2.917-2.534Z"
                        fill="#FC702A"
                        opacity={opacity}
                    />
                    <AnimatedRect
                        data-name="Rect\xE1ngulo 372"
                        width={31.252}
                        height={13.331}
                        rx={2}
                        transform="rotate(8 -2443.867 8263.878)"
                        fill="#FC702A"
                        opacity={opacity}
                    />
                </G>
            </Svg>
        </View>
    );
};

export default IconLogoAnimated;
