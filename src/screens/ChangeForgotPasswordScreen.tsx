import React, { useState, useEffect } from 'react';
import {
    Keyboard,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '../constants/icons/FontAwesome';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { styles } from '../themes/appTheme';
import { PasswordValidationMsg } from '../components/PasswordValidationMsg';
import { useForm } from '../hooks/useForm';
import { useAppDispatch } from '../store/hooks';
import { addToast } from '../store/feature/toast/toastSlice';
import { StatusType } from '../types/common';
import { ArrowBack } from '../components/ArrowBack';
import { BigTitle } from '../components/BigTitle';
import useSpikyService from '../hooks/useSpikyService';

const initialSate = {
    newPassword: '',
    confirmPassword: '',
};

export const ChangeForgotPasswordScreen = ({ route }) => {
    // deep link stuff
    const params = route.params || {};
    const { correo } = params;
    // end deep link stuff
    const dispatch = useAppDispatch();
    const { updatePasswordUri } = useSpikyService();
    const [buttonState, setButtonState] = useState(false);
    const [passVisible1, setPassVisible1] = useState(true);
    const [passVisible2, setPassVisible2] = useState(true);
    const [msgPassword, setMsgPassword] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const navigation = useNavigation<any>();
    const { form, onChange } = useForm(initialSate);

    const { newPassword, confirmPassword } = form;

    const changePassword = async () => {
        if (passwordValid && newPassword === confirmPassword) {
            try {
                await updatePasswordUri(correo, newPassword);
                onChange(initialSate);
                navigation.navigate('LoginScreen');
            } catch (error) {
                console.log(error);
                dispatch(addToast({ message: 'Cambio no completado', type: StatusType.WARNING }));
            }
        } else if (!passwordValid) {
            dispatch(
                addToast({
                    message: 'La contraseña no cumple los criterios',
                    type: StatusType.WARNING,
                })
            );
        } else if (newPassword !== confirmPassword) {
            dispatch(
                addToast({
                    message: 'Las contraseñas no coinciden',
                    type: StatusType.WARNING,
                })
            );
        }
    };

    useEffect(() => {
        if (newPassword !== '' && confirmPassword !== '') {
            setButtonState(true);
        }
    }, [newPassword, confirmPassword]);

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <ArrowBack />
                    <BigTitle texts={['Escribe eso', 'que no saben']} />

                    <Text style={{ ...styles.text, fontSize: 12, marginVertical: 30 }}>
                        Ingrese la nueva contraseña:
                    </Text>

                    <View style={{ ...styles.input, marginBottom: 20, width: 280 }}>
                        <TextInput
                            placeholder="Nueva contraseña"
                            placeholderTextColor="#707070"
                            secureTextEntry={passVisible1}
                            autoCorrect={false}
                            keyboardType="email-address"
                            style={styles.textinput}
                            value={newPassword}
                            onChangeText={value => onChange({ newPassword: value })}
                            onFocus={() => setMsgPassword(true)}
                            onBlur={() => setMsgPassword(false)}
                        />
                        <TouchableOpacity
                            style={styles.iconinput}
                            onPress={() => setPassVisible1(!passVisible1)}
                        >
                            <FontAwesomeIcon
                                icon={passVisible1 ? faEye : faEyeSlash}
                                size={16}
                                color="#d4d4d4"
                            />
                        </TouchableOpacity>

                        {msgPassword && (
                            <PasswordValidationMsg
                                password={newPassword}
                                setPasswordValid={setPasswordValid}
                            />
                        )}
                    </View>

                    <View style={{ ...styles.input, marginBottom: 20, width: 280 }}>
                        <TextInput
                            placeholder="Confirmar contraseña"
                            placeholderTextColor="#707070"
                            autoCorrect={false}
                            keyboardType="email-address"
                            style={styles.textinput}
                            secureTextEntry={passVisible2}
                            value={confirmPassword}
                            onChangeText={value => onChange({ confirmPassword: value })}
                        />
                        <TouchableOpacity
                            style={styles.iconinput}
                            onPress={() => setPassVisible2(!passVisible2)}
                        >
                            <FontAwesomeIcon
                                icon={passVisible2 ? faEye : faEyeSlash}
                                size={16}
                                color="#d4d4d4"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={{
                            ...styles.button,
                            marginTop: 20,
                            borderColor: buttonState ? '#01192E' : '#D4D4D4',
                        }}
                        onPress={buttonState ? changePassword : () => {}}
                    >
                        <Text
                            style={{
                                ...styles.text,
                                fontSize: 14,
                                color: buttonState ? '#01192E' : '#D4D4D4',
                            }}
                        >
                            Restablecer contraseña
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </BackgroundPaper>
    );
};
