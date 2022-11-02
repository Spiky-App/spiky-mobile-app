import React from 'react';
import { useState } from 'react';
import {
    Text,
    TouchableHighlight,
    View,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback,
    TouchableOpacity,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleInfo, faEye, faEyeSlash } from '../constants/icons/FontAwesome';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { useForm } from '../hooks/useForm';
import { styles } from '../themes/appTheme';
import { ArrowBack } from '../components/ArrowBack';
import { BigTitle } from '../components/BigTitle';

export const RegisterScreen = () => {
    const { onChange } = useForm({
        alias: '',
        contrasena: '',
        confirContrasena: '',
    });

    const [passVisible1, setPassVisible1] = useState(true);
    const [passVisible2, setPassVisible2] = useState(true);

    return (
        <BackgroundPaper>
            <ArrowBack />

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <BigTitle texts={['Escribe eso', 'que no saben']} />

                    <Text
                        style={{
                            ...styles.textGrayPad,
                            marginVertical: 15,
                            fontSize: 14,
                            marginLeft: 40,
                        }}
                    >
                        correo1234@uni.mx
                    </Text>

                    <View style={{ ...styles.input, marginBottom: 20 }}>
                        <TextInput
                            placeholder="Seudónimo"
                            autoCorrect={false}
                            keyboardType="email-address"
                            style={styles.textinput}
                            onChangeText={value => onChange({ alias: value })}
                        />
                        <TouchableOpacity style={styles.iconinput}>
                            <FontAwesomeIcon icon={faCircleInfo} size={16} color="#d4d4d4" />
                        </TouchableOpacity>
                    </View>

                    <View style={{ ...styles.input, marginBottom: 20 }}>
                        <TextInput
                            placeholder="Contraseña"
                            secureTextEntry={passVisible1}
                            autoCorrect={false}
                            style={styles.textinput}
                            onChangeText={value => onChange({ contrasena: value })}
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

                    <View style={{ ...styles.input, marginBottom: 30 }}>
                        <TextInput
                            placeholder="Confirmar contraseña"
                            secureTextEntry={passVisible2}
                            autoCorrect={false}
                            style={styles.textinput}
                            onChangeText={value => onChange({ confirContrasena: value })}
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

                    <TouchableHighlight
                        underlayColor="#01192ebe"
                        style={{ ...styles.button, paddingHorizontal: 30 }}
                    >
                        <Text style={{ ...styles.text, ...styles.textb }}>Crear cuenta</Text>
                    </TouchableHighlight>
                </View>
            </TouchableWithoutFeedback>
        </BackgroundPaper>
    );
};
