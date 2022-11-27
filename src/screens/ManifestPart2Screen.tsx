import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Animated, Text, View, TouchableWithoutFeedback } from 'react-native';
import { ArrowBack } from '../components/ArrowBack';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { useAnimation } from '../hooks/useAnimation';
import { styles } from '../themes/appTheme';
import LogoAndIconSvg from '../components/svg/LogoAndIconSvg';

const manifest2 = [
    'Bienvenido spiker',
    '',
    'Eres privilegiado de ser spiker, hazte escuchar',
    'Este espacio se rige por ideas y no por apariencias',
    'Nada es verdadero hasta que la “sabiduría de las masas” lo expresen',
    'Genera discusiones para crear soluciones',
    'Ninguna idea es mala, no tengas pelos en la lengua',
    'No te claves con una idea, es de sabios cambiar de opinión',
    '',
];

export const ManifestPart2Screen = () => {
    const { opacity, position, fadeIn, scale, fadeOut, movingPositionAndScale } = useAnimation({});
    const [state, setState] = useState(0);
    const [aux, setAux] = useState(true);
    const timeRef = useRef<number>(0);
    const navigation = useNavigation<any>();

    const nextManifiesto = () => fadeOut(1000, () => setState(state + 1));

    useEffect(() => {
        if (state > 8) {
            navigation.replace('CommunityScreen');
            clearTimeout(timeRef.current);
        } else if (state === 1) {
            fadeIn(1200);
            timeRef.current = setTimeout(() => {
                setAux(false);
                movingPositionAndScale(0, -320, 1, 0.7, 1500, nextManifiesto);
            }, 2500);
        } else {
            const delay = state == 0 ? 1500 : 4000;
            timeRef.current = setTimeout(nextManifiesto, delay);
            fadeIn(1200, () => {
                if (state === 7) setAux(true);
            });
        }
    }, [state]);

    useEffect(() => {
        setTimeout(() => fadeIn(1200), 1000);
        return () => clearTimeout(timeRef.current);
    }, []);

    return (
        <BackgroundPaper>
            <ArrowBack />

            <TouchableWithoutFeedback
                style={{ ...styles.center }}
                // onPress={() => nextManifiesto()}
            >
                <View style={styles.center}>
                    {state > 0 && state < 8 && (
                        <Animated.View
                            style={{
                                ...styles.center,
                                position: 'absolute',
                                transform: [{ translateY: position }, { scale }],
                                opacity: aux ? opacity : 1,
                            }}
                        >
                            <Text
                                style={{
                                    ...styles.text,
                                    ...styles.h3,
                                    fontSize: 16,
                                    marginBottom: 5,
                                }}
                            >
                                Lo último del
                            </Text>
                            <Text
                                style={{
                                    ...styles.text,
                                    ...styles.h3,
                                    fontSize: 40,
                                }}
                            >
                                manifiesto
                                <Text style={styles.orange}>.</Text>
                            </Text>
                        </Animated.View>
                    )}

                    <Animated.View
                        style={{
                            ...styles.center,
                            flex: 1,
                            opacity,
                        }}
                    >
                        {state < 8 ? (
                            state !== 1 && <Manifiesto state={state} />
                        ) : (
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <View style={{ width: 180 }}>
                                    <LogoAndIconSvg />
                                </View>
                            </View>
                        )}
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        </BackgroundPaper>
    );
};

interface ManifiestoProps {
    state: number;
}

const Manifiesto = ({ state }: ManifiestoProps) => {
    return (
        <View style={{ flexDirection: 'row', marginHorizontal: 50 }}>
            {state !== 0 && (
                <View style={{ ...styles.center, marginRight: 15 }}>
                    <Text style={{ ...styles.text, ...styles.h3, color: '#707070', fontSize: 28 }}>
                        {state + 3 + '.'}
                    </Text>
                </View>
            )}

            <View style={styles.center}>
                <Text style={{ ...styles.text, ...styles.h3, fontSize: 28 }}>
                    {manifest2[state]}
                    <Text style={styles.orange}>.</Text>
                </Text>
            </View>
        </View>
    );
};
