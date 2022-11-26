import React, { useState, useEffect } from 'react';
import { Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import TextInputCustom from '../components/common/TextInput';
import { useNavigation } from '@react-navigation/native';
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
import { setModalAlert } from '../store/feature/ui/uiSlice';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { validatePasswordFields } from '../helpers/passwords';

const initialState = {
    newPassword: '',
    confirmPassword: '',
};

export const ChangeForgotPasswordScreen = ({ route }: { route: any }) => {
    // deep link stuff
    const params = route.params || {};
    const { token, correoValid } = params;
    // end deep link stuff
    const dispatch = useAppDispatch();
    const { updatePasswordUri } = useSpikyService();
    const [buttonState, setButtonState] = useState(false);
    const [passVisible1, setPassVisible1] = useState(true);
    const [passVisible2, setPassVisible2] = useState(true);
    const [msgPassword, setMsgPassword] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const navigation = useNavigation<any>();
    const { form, onChange } = useForm(initialState);

    const { newPassword, confirmPassword } = form;

    const changePassword = async () => {
        const passwordErrors = validatePasswordFields(newPassword, passwordValid, confirmPassword);
        if (passwordErrors === undefined) {
            try {
                if (correoValid && (await updatePasswordUri(token, correoValid, newPassword))) {
                    dispatch(
                        setModalAlert({
                            isOpen: true,
                            text: 'Contraseña restablecida',
                            icon: faLock,
                        })
                    );
                }
                onChange(initialState);
                navigation.navigate('LoginScreen');
            } catch (error) {
                console.log(error);
                dispatch(addToast({ message: 'Cambio no completado', type: StatusType.WARNING }));
            }
        } else {
            dispatch(addToast(passwordErrors));
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

                    <View style={{ marginBottom: 20 }}>
                        <TextInputCustom
                            placeholder="Nueva contraseña"
                            secureTextEntry={passVisible1}
                            autoCorrect={false}
                            style={{ ...styles.textinput, ...styles.shadow }}
                            value={newPassword}
                            onChangeText={value => onChange({ newPassword: value })}
                            onFocus={() => setMsgPassword(true)}
                            onBlur={() => setMsgPassword(false)}
                            icon={passVisible1 ? faEye : faEyeSlash}
                            touchableOpacityProps={{
                                onPress: () => setPassVisible1(!passVisible1),
                            }}
                        />
                        {msgPassword && (
                            <PasswordValidationMsg
                                password={newPassword}
                                setPasswordValid={setPasswordValid}
                            />
                        )}
                    </View>

                    <View style={{ marginBottom: 20 }}>
                        <TextInputCustom
                            placeholder="Confirmar contraseña"
                            secureTextEntry={passVisible2}
                            autoCorrect={false}
                            style={{ ...styles.textinput, ...styles.shadow }}
                            value={confirmPassword}
                            onChangeText={value => onChange({ confirmPassword: value })}
                            icon={passVisible2 ? faEye : faEyeSlash}
                            touchableOpacityProps={{
                                onPress: () => setPassVisible2(!passVisible2),
                            }}
                        />
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
