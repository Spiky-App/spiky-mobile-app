import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useAnimation } from '../hooks/useAnimation';
import { faCheck } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';

interface Props {
    password: string;
    setPasswordValid: (value: boolean) => void;
}

const regularExpressionNumbers = /^(?=.*[0-9])/;
const regularExpressionLowerCases = /^(?=.*[a-z])/;
const regularExpressionUpperCases = /^(?=.*[A-Z])/;

export const PasswordValidationMsg = ({ password, setPasswordValid }: Props) => {
    const { opacity, fadeIn } = useAnimation({});
    const [contraints, setConstraints] = useState({
        longer: false,
        uppercase: false,
        lowercase: false,
        number: false,
    });
    const { longer, uppercase, lowercase, number } = contraints;

    useEffect(() => {
        fadeIn();
    }, []);

    useEffect(() => {
        if (longer && uppercase && lowercase && number) {
            setPasswordValid(true);
        }
    }, [contraints]);

    useEffect(() => {
        setConstraints({
            longer: password.length >= 8,
            uppercase: regularExpressionUpperCases.test(password),
            lowercase: regularExpressionLowerCases.test(password),
            number: regularExpressionNumbers.test(password),
        });
    }, [password, setConstraints]);

    return (
        <Animated.View
            style={{
                ...styles.input,
                position: 'absolute',
                width: 280,
                top: -110,
                opacity,
            }}
        >
            <Text style={{ ...styles.text, ...styles.textGray, fontSize: 12, marginBottom: 6 }}>
                La contraseña debe de contener al menos:
            </Text>

            <View
                style={{ alignItems: 'center', flexDirection: 'row', marginTop: 2, marginLeft: 8 }}
            >
                <View
                    style={{
                        backgroundColor: '#707070',
                        width: 6,
                        height: 6,
                        borderRadius: 6,
                        marginRight: 6,
                    }}
                />
                <Text style={{ ...stylescom.text, color: longer ? '#0B5F00' : '#707070' }}>
                    Minimo 8 caracteres.
                </Text>
                {longer && <FontAwesomeIcon icon={faCheck} size={12} color="#0B5F00" />}
            </View>

            <View
                style={{ alignItems: 'center', flexDirection: 'row', marginTop: 2, marginLeft: 8 }}
            >
                <View
                    style={{
                        backgroundColor: '#707070',
                        width: 6,
                        height: 6,
                        borderRadius: 6,
                        marginRight: 6,
                    }}
                />
                <Text style={{ ...stylescom.text, color: uppercase ? '#0B5F00' : '#707070' }}>
                    Una letra mayúscula.
                </Text>
                {uppercase && <FontAwesomeIcon icon={faCheck} size={12} color="#0B5F00" />}
            </View>

            <View
                style={{ alignItems: 'center', flexDirection: 'row', marginTop: 2, marginLeft: 8 }}
            >
                <View
                    style={{
                        backgroundColor: '#707070',
                        width: 6,
                        height: 6,
                        borderRadius: 6,
                        marginRight: 6,
                    }}
                />
                <Text style={{ ...stylescom.text, color: lowercase ? '#0B5F00' : '#707070' }}>
                    Una letra minúscula.
                </Text>
                {lowercase && <FontAwesomeIcon icon={faCheck} size={12} color="#0B5F00" />}
            </View>

            <View
                style={{ alignItems: 'center', flexDirection: 'row', marginTop: 2, marginLeft: 8 }}
            >
                <View
                    style={{
                        backgroundColor: '#707070',
                        width: 6,
                        height: 6,
                        borderRadius: 6,
                        marginRight: 6,
                    }}
                />
                <Text style={{ ...stylescom.text, color: number ? '#0B5F00' : '#707070' }}>
                    Un numero
                </Text>
                {number && <FontAwesomeIcon icon={faCheck} size={12} color="#0B5F00" />}
            </View>
        </Animated.View>
    );
};

const stylescom = StyleSheet.create({
    text: {
        ...styles.text,
        ...styles.textGray,
        fontSize: 12,
        marginRight: 5,
    },
});
