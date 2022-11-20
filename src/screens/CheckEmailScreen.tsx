import React, { useEffect, useRef, useState } from 'react';
import {
    Text,
    TouchableHighlight,
    View,
    Keyboard,
    TouchableWithoutFeedback,
    Animated,
    Pressable,
} from 'react-native';
import { ArrowBack } from '../components/ArrowBack';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { useForm } from '../hooks/useForm';
import { styles } from '../themes/appTheme';
import { BigTitle } from '../components/BigTitle';
import { useAnimation } from '../hooks/useAnimation';
import LogoSvg from '../components/svg/LogoSvg';
import useSpikyService from '../hooks/useSpikyService';
import { LoadingAnimated } from '../components/svg/LoadingAnimated';
import TextInputCustom from '../components/common/TextInput';
import { HelperMessage } from '../types/common';
import { getFormHelperMessage } from '../helpers/login.herlpers';

export const CheckEmailScreen = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isFormValid, setFormValid] = useState(true);
    const refTimeToVerif = useRef<number>(0);
    const [message, setMessage] = useState<string | null>(null);
    const [timetoverif, setTimetoverif] = useState<number | null>(null);
    const [remainTime, setRemainTime] = useState<number>(0);
    const [clock, setClock] = useState<string | null>(null);
    const { getEmailVerification } = useSpikyService();
    const { onChange, email } = useForm({
        email: '',
    });

    async function handleSumbit() {
        if (email) {
            setIsLoading(true);
            const msg = await getEmailVerification(email);
            setMessage(msg ? msg : null);
            setTimetoverif(Date.now());
            setIsLoading(false);
        } else {
            setFormValid(false);
        }
    }

    function getHelperMessage(value: string): HelperMessage | undefined {
        if (!isFormValid) {
            return getFormHelperMessage(value);
        }
    }

    useEffect(() => {
        if (timetoverif) {
            let difTime = Date.now() - timetoverif;
            let sec_dif = Math.floor(difTime / 1000);
            let wait = 120;

            if (sec_dif < wait) {
                setRemainTime(wait - sec_dif);
            } else {
                setRemainTime(0);
            }
        }
    }, [timetoverif]);

    useEffect(() => {
        if (!refTimeToVerif.current && remainTime > 0) {
            refTimeToVerif.current = setInterval(() => {
                setRemainTime(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
            }, 1000);
        }
        if (remainTime > 0) {
            let minutes = Math.floor(remainTime / 60);
            let seconds = Math.floor(remainTime - minutes * 60);
            setClock(`${minutes}:${seconds.toString().length === 2 ? seconds : '0' + seconds}`);
        } else {
            clearInterval(refTimeToVerif.current);
        }
    }, [remainTime]);

    const VerifyMail = () =>
        isLoading ? (
            <View style={{ ...styles.center }}>
                <LoadingAnimated />
                <Text style={{ ...styles.textGray }}>Enviando correo</Text>
            </View>
        ) : (
            <>
                <View style={{ marginVertical: 25 }}>
                    <TextInputCustom
                        placeholder="Correo universitario"
                        autoCorrect={false}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        onChangeText={value => onChange({ email: value })}
                        helperMessage={getHelperMessage(email)}
                    />
                </View>
                <TouchableHighlight
                    underlayColor="#01192ebe"
                    onPress={handleSumbit}
                    style={{ ...styles.button, paddingHorizontal: 30 }}
                >
                    <Text style={{ ...styles.text, ...styles.textb }}>Verificar correo</Text>
                </TouchableHighlight>
            </>
        );

    return (
        <BackgroundPaper>
            <ArrowBack />

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.center}>
                    <BigTitle texts={['Sé parte', 'del cambio']} />
                    <View style={{ ...styles.center, minHeight: 150 }}>
                        {message ? (
                            <View style={{ width: 250, marginTop: 15 }}>
                                <Text style={{ ...styles.text, fontSize: 14 }}>{message}</Text>
                                <Text style={{ ...styles.textbold, fontSize: 14, marginTop: 10 }}>
                                    {email}
                                </Text>
                                <View style={{ ...styles.center }}>
                                    {remainTime > 0 ? (
                                        <Text style={{ ...styles.text, marginVertical: 20 }}>
                                            {`Reenviar correo: ${clock}`}
                                        </Text>
                                    ) : (
                                        <>
                                            <TouchableHighlight
                                                underlayColor="#01192ebe"
                                                onPress={() => handleSumbit()}
                                                style={{
                                                    ...styles.button,
                                                    ...styles.center,
                                                    paddingHorizontal: 10,
                                                    marginVertical: 20,
                                                    width: 200,
                                                }}
                                            >
                                                <Text style={{ ...styles.text, ...styles.textb }}>
                                                    Reenviar correo
                                                </Text>
                                            </TouchableHighlight>
                                            <Pressable
                                                onPress={() => setMessage(null)}
                                                style={styles.center}
                                            >
                                                <Text
                                                    style={{
                                                        ...styles.text,
                                                        ...styles.link,
                                                        fontSize: 13,
                                                    }}
                                                >
                                                    Cambiar correo
                                                </Text>
                                            </Pressable>
                                        </>
                                    )}
                                </View>
                            </View>
                        ) : (
                            <VerifyMail />
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <LogoFadeIn />
        </BackgroundPaper>
    );
};

const LogoFadeIn = () => {
    const { opacity, fadeIn } = useAnimation({});

    useEffect(() => {
        fadeIn(800, () => {}, 1000);
    }, []);

    return (
        <View
            style={{
                position: 'absolute',
                bottom: 40,
                left: 0,
                right: 0,
                alignItems: 'center',
            }}
        >
            <Animated.View style={{ width: 100, opacity }}>
                <LogoSvg />
            </Animated.View>
        </View>
    );
};
