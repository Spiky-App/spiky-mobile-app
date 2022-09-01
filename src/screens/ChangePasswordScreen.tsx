import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash, faArrowLeftLong, faLock } from '../constants/icons/FontAwesome';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { styles } from '../themes/appTheme';
import { PasswordValidationMsg } from '../components/PasswordValidationMsg';
import { useForm } from '../hooks/useForm';
import SpikyService from '../services/SpikyService';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import { addToast } from '../store/feature/toast/toastSlice';
import { StatusType } from '../types/common';
import { setModalAlert } from '../store/feature/ui/uiSlice';

const initialSate = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
};

export const ChangePasswordScreen = () => {
    const uid = useAppSelector((state: RootState) => state.user.id);
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const service = new SpikyService(config);
    const dispatch = useAppDispatch();
    const [buttonState, setButtonState] = useState(false);
    const [passVisible1, setPassVisible1] = useState(true);
    const [passVisible2, setPassVisible2] = useState(true);
    const [msgPassword, setMsgPassword] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const navigation = useNavigation<any>();
    const { form, onChange } = useForm(initialSate);

    const { currentPassword, newPassword, confirmPassword } = form;

    const changePassword = async () => {
        if (passwordValid && newPassword === confirmPassword) {
            try {
                await service.updatePassword(uid, currentPassword, newPassword);
                onChange(initialSate);
                dispatch(
                    setModalAlert({
                        isOpen: true,
                        text: 'Constraseña restablecida',
                        icon: faLock,
                    })
                );
            } catch (error) {
                console.log(error);
                dispatch(addToast({ message: 'Contraseña incorrecta', type: StatusType.WARNING }));
            }
        } else if (!passwordValid) {
            dispatch(
                addToast({
                    message: 'Contraseña no cumple los criterios',
                    type: StatusType.WARNING,
                })
            );
        } else if (newPassword !== confirmPassword) {
            dispatch(
                addToast({
                    message: 'Las contraseñan no coinciden',
                    type: StatusType.WARNING,
                })
            );
        }
    };

    useEffect(() => {
        if (currentPassword !== '' && newPassword !== '' && confirmPassword !== '') {
            setButtonState(true);
        }
    }, [currentPassword, newPassword, confirmPassword]);

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <View style={{ ...styles.center, marginTop: 30 }}>
                <TouchableOpacity
                    style={{ ...styles.center, position: 'absolute', left: -40, top: 0, bottom: 0 }}
                    onPress={() => navigation.navigate('ConfigurationScreen')}
                >
                    <FontAwesomeIcon icon={faArrowLeftLong} size={27} color="#959595" />
                </TouchableOpacity>

                <Text style={{ ...styles.text, ...styles.h3 }}>
                    Cambio de contraseña
                    <Text style={styles.orange}>.</Text>
                </Text>
            </View>

            <View style={styles.center}>
                <Text style={{ ...styles.text, fontSize: 12, marginVertical: 30 }}>
                    Ingrese la actual y nueva contraseña:
                </Text>

                <View style={{ ...styles.input, marginBottom: 20, width: 280 }}>
                    <TextInput
                        placeholder="Contraseña actual"
                        secureTextEntry={passVisible1}
                        autoCorrect={false}
                        keyboardType="email-address"
                        style={styles.textinput}
                        value={currentPassword}
                        onChangeText={value => onChange({ currentPassword: value })}
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
                </View>

                <View style={{ ...styles.input, marginBottom: 20, width: 280 }}>
                    <TextInput
                        placeholder="Nueva contraseña"
                        secureTextEntry={passVisible2}
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
                        onPress={() => setPassVisible2(!passVisible2)}
                    >
                        <FontAwesomeIcon
                            icon={passVisible2 ? faEye : faEyeSlash}
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
                        autoCorrect={false}
                        keyboardType="email-address"
                        style={styles.textinput}
                        secureTextEntry={true}
                        value={confirmPassword}
                        onChangeText={value => onChange({ confirmPassword: value })}
                    />
                </View>

                <TouchableOpacity
                    style={{
                        ...styles.button,
                        marginTop: 50,
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
                        Cambiar contraseña
                    </Text>
                </TouchableOpacity>
            </View>
        </BackgroundPaper>
    );
};
