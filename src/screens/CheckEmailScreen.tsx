import React, { useEffect } from 'react';
import {
    Text,
    TouchableHighlight,
    View,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback,
    Button,
    Animated,
} from 'react-native';
import { ArrowBack } from '../components/ArrowBack';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { useForm } from '../hooks/useForm';
import { styles } from '../themes/appTheme';
import { BigTitle } from '../components/BigTitle';
import { useNavigation } from '@react-navigation/native';
import { useAnimation } from '../hooks/useAnimation';
import LogoSvg from '../components/svg/LogoSvg';

export const CheckEmailScreen = () => {
    //Borrar este hook
    const navigation = useNavigation<any>();
    const { onChange, email } = useForm({
        email: '',
    });

    return (
        <BackgroundPaper>
            <ArrowBack />

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <BigTitle texts={['Sé parte', 'del cambio']} />

                    <View style={{ ...styles.input, marginVertical: 25 }}>
                        <TextInput
                            placeholder="Correo universitario"
                            autoCorrect={false}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            style={styles.textinput}
                            onChangeText={value => onChange({ email: value })}
                        />
                    </View>

                    <TouchableHighlight
                        underlayColor="#01192ebe"
                        onPress={() => console.log('verifying email', email)}
                        style={{ ...styles.button, paddingHorizontal: 30 }}
                    >
                        <Text style={{ ...styles.text, ...styles.textb }}>Verificar correo</Text>
                    </TouchableHighlight>

                    {/* Borrar este boton, solo para acceder a este screen */}
                    <Button
                        title="Register Screen"
                        onPress={() => navigation.navigate('RegisterScreen')}
                    />
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
            <Animated.View style={{ width: 115, opacity }}>
                <LogoSvg />
            </Animated.View>
        </View>
    );
};
