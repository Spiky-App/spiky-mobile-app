import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Alert,
    Keyboard,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { ArrowBack } from '../components/ArrowBack';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { BigTitle } from '../components/BigTitle';
import TextInputCustom from '../components/common/TextInput';
import { LoadingAnimated } from '../components/svg/LoadingAnimated';
import { faEye, faEyeSlash } from '../constants/icons/FontAwesome';
import { getFormHelperMessage, validateForm } from '../helpers/login.herlpers';
import { useFirebaseMessaging } from '../hooks/useFirebaseMessaging';
import { useForm } from '../hooks/useForm';
import useSpikyService from '../hooks/useSpikyService';
import { RootStackParamList } from '../navigator/Navigator';
import { styles } from '../themes/appTheme';
import { HelperMessage } from '../types/common';
import { FormState } from '../types/login';
import { StorageKeys } from '../types/storage';

export const LoginScreen = () => {
    const { form, onChange } = useForm<FormState>({
        email: '',
        password: '',
    });
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [isFormValid, setFormValid] = useState(true);
    const [isLoading, setLoading] = useState(false);
    const [passVisible, setPassVisible] = useState(true);
    const { logInUser } = useSpikyService();
    const { getTokenDevice } = useFirebaseMessaging();

    async function login() {
        setLoading(true);
        if (validateForm(form)) {
            const { email, password } = form;
            try {
                let deviceTokenStorage = await AsyncStorage.getItem(StorageKeys.DEVICE_TOKEN);
                if (!deviceTokenStorage) {
                    await getTokenDevice();
                    deviceTokenStorage = await AsyncStorage.getItem(StorageKeys.DEVICE_TOKEN);
                }
                if (deviceTokenStorage) {
                    const status = await logInUser(email, password, deviceTokenStorage);
                    if (status) {
                        setFormValid(true);
                    } else {
                        setFormValid(false);
                    }
                }
            } catch (error) {
                let err = `Error: ${error}`;
                Alert.alert(err);
            }
        } else {
            setFormValid(false);
        }
        setLoading(false);
    }

    function getHelperMessage(value: string): HelperMessage | undefined {
        if (!isFormValid) {
            return getFormHelperMessage(value);
        }
    }

    return (
        <BackgroundPaper>
            <ArrowBack />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ marginBottom: 40 }}>
                        <BigTitle texts={['Agente', 'de cambio']} />
                    </View>
                    <View style={{ marginBottom: 20 }}>
                        <TextInputCustom
                            placeholder="Correo o seudónimo"
                            autoCorrect={false}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            onChangeText={value => onChange({ email: value })}
                            helperMessage={getHelperMessage(form.email)}
                        />
                    </View>
                    <View style={{ marginBottom: 20 }}>
                        <TextInputCustom
                            placeholder="Contraseña"
                            secureTextEntry={passVisible}
                            autoCorrect={false}
                            style={{ ...styles.textinput, ...styles.shadow }}
                            onChangeText={value => onChange({ password: value })}
                            helperMessage={getHelperMessage(form.password)}
                            icon={passVisible ? faEye : faEyeSlash}
                            touchableOpacityProps={{ onPress: () => setPassVisible(!passVisible) }}
                            onSubmitEditing={login}
                        />
                    </View>

                    {isLoading ? (
                        <View style={{ ...styles.center, minHeight: 170 }}>
                            <Text style={{ ...styles.text, ...styles.textb, marginBottom: 10 }}>
                                Cargando...
                            </Text>
                            <LoadingAnimated />
                        </View>
                    ) : (
                        <View style={{ ...styles.center, minHeight: 170 }}>
                            <TouchableOpacity
                                style={{ marginBottom: 35 }}
                                onPress={() => navigation.navigate('ForgotPwdScreen')}
                            >
                                <Text style={styles.linkPad}>¿Olvidaste tu contraseña?</Text>
                            </TouchableOpacity>
                            <TouchableHighlight
                                underlayColor="#01192ebe"
                                onPress={login}
                                style={{
                                    ...styles.button,
                                    paddingHorizontal: 30,
                                }}
                                disabled={isLoading}
                            >
                                <Text
                                    style={{
                                        ...styles.text,
                                        ...styles.textb,
                                    }}
                                >
                                    Iniciar sesión
                                </Text>
                            </TouchableHighlight>
                            <TouchableOpacity
                                style={{ marginBottom: 35 }}
                                onPress={() => navigation.navigate('ManifestPart1Screen')}
                            >
                                <Text style={styles.linkPad}>Solicitar cuenta</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </BackgroundPaper>
    );
};
