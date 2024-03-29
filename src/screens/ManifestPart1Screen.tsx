import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Animated, Text, View, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { ArrowBack } from '../components/ArrowBack';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { useAnimation } from '../hooks/useAnimation';
import { styles } from '../themes/appTheme';

const manifest1 = [
    'Antes de eso..',
    '',
    'Es tiempo de hablar, di lo que tengas que decir',
    'Mantente anónimo, no des pista de quién eres',
    'Escucha, contribuye y conecta (u oponte)',
    'Di lo que nadie se atreve a decir y pon el mundo de cabeza',
    'Conocerás más siendo miembro..',
];

export const ManifestPart1Screen = () => {
    const { opacity, position, fadeIn, scale, fadeOut, movingPositionAndScale } = useAnimation({});
    const [state, setState] = useState(0);
    const [aux, setAux] = useState(true);
    const timeRef = useRef<number>(0);
    const navigation = useNavigation<any>();

    const nextManifiesto = () => {
        fadeOut(500, () => setState(state + 1));
    };

    const handleForceNextManifiesto = () => {
        clearTimeout(timeRef.current);
        nextManifiesto();
    };

    useEffect(() => {
        if (state > 6) {
            navigation.replace('CheckEmailScreen');
            clearTimeout(timeRef.current);
        } else if (state === 1) {
            fadeIn(900);
            timeRef.current = setTimeout(() => {
                setAux(false);
                movingPositionAndScale(
                    0,
                    Dimensions.get('window').height / -2 + 80,
                    1,
                    0.7,
                    900,
                    nextManifiesto
                );
            }, 1500);
        } else {
            const delay = state === 0 ? 1000 : 2200;
            timeRef.current = setTimeout(nextManifiesto, delay);
            fadeIn(800);
        }
    }, [state]);

    useEffect(() => {
        setTimeout(() => fadeIn(800), 800);
        return () => clearTimeout(timeRef.current);
    }, []);

    return (
        <BackgroundPaper>
            <ArrowBack />

            <TouchableWithoutFeedback
                style={{ ...styles.center }}
                onPress={() => handleForceNextManifiesto()}
            >
                <View style={styles.center}>
                    {state > 0 && (
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
                                Conoce nuestro
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
                        {state !== 1 && <Manifiesto state={state} />}
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
            {state !== 6 && state !== 0 && (
                <View style={{ ...styles.center, marginRight: 15 }}>
                    <Text style={{ ...styles.text, ...styles.h3, color: '#707070', fontSize: 28 }}>
                        {state - 1 + '.'}
                    </Text>
                </View>
            )}

            <View style={styles.center}>
                <Text style={{ ...styles.text, ...styles.h3, fontSize: 28 }}>
                    {manifest1[state]}
                    <Text style={styles.orange}>.</Text>
                </Text>
            </View>
        </View>
    );
};
