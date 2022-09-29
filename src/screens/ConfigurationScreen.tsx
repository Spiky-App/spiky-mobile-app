import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { faLightbulb, faCheck, faXmark } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import { LoadingAnimated } from '../components/svg/LoadingAnimated';
import { useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import { UsuariorData } from '../types/services/spiky';
import useSpikyService from '../hooks/useSpikyService';

interface UserData {
    email: string;
    university: string;
    messagesNumber: number;
    favorNumber: number;
    againstNumber: number;
}

function generateDataFromData(data: UsuariorData): UserData {
    return {
        email: data.correo,
        university: data.universidad,
        messagesNumber: data.n_mensajes,
        favorNumber: data.n_favor,
        againstNumber: data.n_contra,
    };
}

export const ConfigurationScreen = () => {
    const nickname = useAppSelector((state: RootState) => state.user.nickname);
    const { loadUserInfo } = useSpikyService();
    const navigation = useNavigation<any>();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<UserData>({
        email: '',
        university: '',
        messagesNumber: 0,
        favorNumber: 0,
        againstNumber: 0,
    });

    const loadData = async () => {
        const usuario = await loadUserInfo();
        setData(generateDataFromData(usuario));
        setLoading(false);
    };

    useFocusEffect(() => {
        loadData();
    });

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }} hasHeader={true}>
            {!loading ? (
                <>
                    <Text style={{ ...styles.text, ...styles.h3, marginTop: 30 }}>
                        Información
                        <Text style={styles.orange}>.</Text>
                    </Text>

                    <View style={{ marginVertical: 30 }}>
                        <View style={stylescom.longContainer}>
                            <Text style={{ ...styles.text, ...styles.h5 }}>@seudónimo:</Text>
                            <View style={{ ...styles.input, width: 190, marginLeft: 15 }}>
                                <Text style={{ ...styles.text }}>{nickname}</Text>
                            </View>
                        </View>

                        <View style={stylescom.longContainer}>
                            <Text style={{ ...styles.text, ...styles.h5 }}>Correo:</Text>
                            <View style={{ ...styles.input, maxWidth: 190, marginLeft: 15 }}>
                                <Text style={{ ...styles.text }}>{data.email}</Text>
                            </View>
                        </View>

                        <View style={stylescom.longContainer}>
                            <Text style={{ ...styles.text, ...styles.h5 }}>Institución:</Text>
                            <View style={{ ...styles.input, width: 190, marginLeft: 15 }}>
                                <Text style={{ ...styles.text }}>{data.university}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ ...styles.flex, justifyContent: 'space-evenly', width: '80%' }}>
                        <View style={styles.center}>
                            <FontAwesomeIcon icon={faLightbulb} color="#01192E" size={28} />
                            <View style={{ ...styles.shadow, ...stylescom.padd }}>
                                <Text style={{ ...styles.text, fontSize: 26, fontWeight: '300' }}>
                                    {data.messagesNumber}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.center}>
                            <FontAwesomeIcon icon={faCheck} color="#01192E" size={28} />
                            <View style={{ ...styles.shadow, ...stylescom.padd }}>
                                <Text style={{ ...styles.text, fontSize: 26, fontWeight: '300' }}>
                                    {data.favorNumber}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.center}>
                            <FontAwesomeIcon icon={faXmark} color="#01192E" size={28} />
                            <View style={{ ...styles.shadow, ...stylescom.padd }}>
                                <Text style={{ ...styles.text, fontSize: 26, fontWeight: '300' }}>
                                    {data.againstNumber}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginVertical: 50 }}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('ChangePasswordScreen')}
                        >
                            <Text style={{ ...styles.text, fontSize: 13 }}>Cambiar contraseña</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <View style={{ ...styles.center, flex: 1 }}>
                    <LoadingAnimated />
                </View>
            )}
        </BackgroundPaper>
    );
};

const stylescom = StyleSheet.create({
    padd: {
        ...styles.center,
        paddingHorizontal: 15,
        paddingVertical: 15,
        marginTop: 15,
        minWidth: 60,
    },
    longContainer: {
        ...styles.flex,
        ...styles.center,
        marginBottom: 20,
        justifyContent: 'flex-end',
    },
});
