import React, { useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { styles } from '../themes/appTheme';
import { LoadingAnimated } from '../components/svg/LoadingAnimated';
import { useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import { UserI } from '../types/services/spiky';
import useSpikyService from '../hooks/useSpikyService';

interface UserData {
    email: string;
    university: string;
}

function generateDataFromData(data: UserI): UserData {
    return {
        email: data.correo,
        university: data.universidad,
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
    });

    const loadData = async () => {
        const usuario = await loadUserInfo();
        if (usuario) {
            setData(generateDataFromData(usuario));
            setLoading(false);
        }
    };

    useFocusEffect(() => {
        loadData();
    });

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
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
