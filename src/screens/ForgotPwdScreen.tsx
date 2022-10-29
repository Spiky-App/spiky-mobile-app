import React, { useState } from 'react';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { ArrowBack } from '../components/ArrowBack';
import {
    Keyboard,
    TouchableWithoutFeedback,
    View,
    TextInput,
    TouchableHighlight,
    Text,
    StyleSheet,
} from 'react-native';
import { BigTitle } from '../components/BigTitle';
import { useForm } from '../hooks/useForm';
import { styles } from '../themes/appTheme';
import { validateForm } from '../helpers/forgotPass.helpers';
import { FormState } from '../types/forgotPass';
import SpikyService from '../services/SpikyService';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import { addToast } from '../store/feature/toast/toastSlice';
import { StatusType } from '../types/common';
import { LoadingAnimated } from '../components/svg/LoadingAnimated';

export const ForgotPwdScreen = () => {
    const [isLoading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const spikyService = new SpikyService(config);
    const [underlyingValue, setUnderlyingValue] = useState(
        'Ingrese correo electrónico y le enviaremos \ninstrucciones para restablecer su contraseña.'
    );
    const [isNextMsg, setNextMsg] = useState(false);
    const [defaultEmailValue, setDefaultEmailValue] = useState('');
    const { form, onChange } = useForm<FormState>({
        email: '',
    });
    async function sendReestablishPasswordEmail() {
        setLoading(true);
        if (validateForm(form)) {
            const { email } = form;
            try {
                const response = await spikyService.forgotPassword(email);
                const { data } = response;
                // this is were the response message is displayed
                setUnderlyingValue(data.msg);
                setNextMsg(true);
                setDefaultEmailValue(email);
            } catch (err) {
                console.log(err);
                dispatch(
                    addToast({ message: 'Error enviado el correo', type: StatusType.WARNING })
                );
            }
        } else {
        }
        setLoading(false);
    }
    function handleReestablishEmail() {
        setUnderlyingValue(
            'Ingrese correo electrónico y le enviaremos \ninstrucciones para restablecer su contraseña.'
        );
        setNextMsg(false);
        setLoading(false);
    }

    return (
        <BackgroundPaper>
            <ArrowBack />

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <BigTitle texts={['Olvida eso', 'que te detiene']} />

                    {!isNextMsg ? (
                        <View style={{ ...styles.input, marginBottom: 5, marginTop: 25 }}>
                            <TextInput
                                placeholder="Correo universitario"
                                autoCorrect={false}
                                keyboardType="email-address"
                                style={styles.textinput}
                                onChangeText={value => onChange({ email: value })}
                                autoCapitalize={'none'}
                                editable={!isLoading}
                                defaultValue={defaultEmailValue}
                            />
                        </View>
                    ) : (
                        <View style={{ marginBottom: 10, marginTop: 30 }}>
                            <Text style={{ ...styles.textbold }}>{defaultEmailValue}</Text>
                        </View>
                    )}

                    <Text style={{ ...styles.textGrayPad, marginBottom: 25 }}>
                        {underlyingValue}
                    </Text>
                    {!isLoading ? (
                        !isNextMsg ? (
                            <TouchableHighlight
                                underlayColor="#01192ebe"
                                onPress={sendReestablishPasswordEmail}
                                style={{ ...styles.button, paddingHorizontal: 30 }}
                                disabled={isLoading}
                            >
                                <Text
                                    style={{
                                        ...styles.text,
                                        ...styles.textb,
                                    }}
                                >
                                    Cambiar Contraseña
                                </Text>
                            </TouchableHighlight>
                        ) : (
                            <TouchableHighlight
                                underlayColor="#01192ebe"
                                onPress={handleReestablishEmail}
                                style={{ ...styles.button, paddingHorizontal: 30 }}
                                disabled={isLoading}
                            >
                                <Text
                                    style={{
                                        ...styles.text,
                                        ...styles.textb,
                                    }}
                                >
                                    Cambiar Correo
                                </Text>
                            </TouchableHighlight>
                        )
                    ) : (
                        <View>
                            <Text style={{ ...styles.textGray }}>Enviando Correo...</Text>
                            <LoadingAnimated />
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </BackgroundPaper>
    );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stylescom = StyleSheet.create({
    container: {
        justifyContent: 'center',
        marginHorizontal: 20,
    },
});
