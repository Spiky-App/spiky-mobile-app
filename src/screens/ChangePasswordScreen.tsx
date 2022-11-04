import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash, faArrowLeftLong, faLock } from '../constants/icons/FontAwesome';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { styles } from '../themes/appTheme';
import { PasswordValidationMsg } from '../components/PasswordValidationMsg';
import { useForm } from '../hooks/useForm';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import { addToast } from '../store/feature/toast/toastSlice';
import { StatusType } from '../types/common';
import { setModalAlert } from '../store/feature/ui/uiSlice';
import useSpikyService from '../hooks/useSpikyService';

const initialSate = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
};

// https://reactnative.dev/docs/linking
// https://blog.jscrambler.com/how-to-handle-deep-linking-in-a-react-native-app/
// https://stackoverflow.com/questions/28802115/i-am-trying-to-test-android-deep-link-urls-through-adb-to-launch-my-app
// https://roycjh.medium.com/how-to-direct-users-from-email-to-your-mobile-app-or-website-using-deep-links-2727af0fc74a
// https://stackoverflow.com/questions/53037786/how-to-display-ios-apps-deep-links-on-email-as-links

export const ChangePasswordScreen = ({ route }) => {
    // deep link stuff
    const params = route.params || {};
    const { correo } = params;
    // end deep link stuff
    const uid = useAppSelector((state: RootState) => state.user.id);
    const { updatePassword, updatePasswordUri } = useSpikyService();
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
                // if route contains an email, that means the screen came by the uri and must go back to home
                if (correo) {
                    await updatePasswordUri(correo, currentPassword, newPassword);
                    navigation.navigate('HomeScreen');
                    onChange(initialSate);
                    dispatch(
                        setModalAlert({
                            isOpen: true,
                            text: 'Contraseña restablecida',
                            icon: faLock,
                        })
                    );
                } else {
                    await updatePassword(uid, currentPassword, newPassword);
                    onChange(initialSate);
                    dispatch(
                        setModalAlert({
                            isOpen: true,
                            text: 'Contraseña restablecida',
                            icon: faLock,
                        })
                    );
                    navigation.navigate('ConfigurationScreen');
                }
            } catch (error) {
                console.log(error);
                dispatch(addToast({ message: 'Contraseña incorrecta', type: StatusType.WARNING }));
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
        if (currentPassword !== '' && newPassword !== '' && confirmPassword !== '') {
            setButtonState(true);
        }
    }, [currentPassword, newPassword, confirmPassword]);

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <View style={{ ...styles.center, marginTop: 30 }}>
                <TouchableOpacity
                    style={{ ...styles.center, position: 'absolute', left: -40, top: 0, bottom: 0 }}
                    onPress={
                        !correo
                            ? () => navigation.navigate('ConfigurationScreen')
                            : () => navigation.navigate('HomeScreen')
                    }
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
                        placeholderTextColor="#707070"
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
                        placeholderTextColor="#707070"
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
                        placeholderTextColor="#707070"
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
