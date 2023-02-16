import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { styles } from '../themes/appTheme';
import { LoadingAnimated } from '../components/svg/LoadingAnimated';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import { UserInfo } from '../types/services/spiky';
import useSpikyService from '../hooks/useSpikyService';
import NetworkErrorFeed from '../components/NetworkErrorFeed';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../navigator/MenuMain';
import { setModalAlert } from '../store/feature/ui/uiSlice';
import { ModalConfirmation } from '../components/ModalConfirmation';
import { faUserSlash } from '../constants/icons/FontAwesome';

type NavigationProp = DrawerNavigationProp<DrawerParamList>;

interface UserData {
    email: string;
    university: string;
}

function generateDataFromData(data: UserInfo): UserData {
    return {
        email: data.correo,
        university: data.universidad,
    };
}

export const ConfigurationScreen = () => {
    const nickname = useAppSelector((state: RootState) => state.user.nickname);
    const { getUserInfo, logOutFunction, deleteAccount } = useSpikyService();
    const navigation = useNavigation<NavigationProp>();
    const [loading, setLoading] = useState(true);
    const [networkError, setNetworkError] = useState(false);
    const [allowChangeAlias, setAllowChangeAlias] = useState(false);
    const [isOpenConfirmation, setIsOpenConfirmation] = useState(false);
    const dispatch = useAppDispatch();
    const [data, setData] = useState<UserData>({
        email: '',
        university: '',
    });

    async function loadData() {
        if (networkError) setNetworkError(false);
        const {
            userInfo,
            networkError: networkErrorReturn,
            change_alias: changeAliasReturn,
        } = await getUserInfo();
        if (changeAliasReturn) setAllowChangeAlias(true);
        if (networkErrorReturn) setNetworkError(true);
        if (userInfo) {
            setData(generateDataFromData(userInfo));
            setLoading(false);
        }
    }

    async function handleDeleteAccount() {
        await deleteAccount();
        dispatch(
            setModalAlert({
                isOpen: true,
                text: 'Cuenta eliminada',
                icon: faUserSlash,
            })
        );
        logOutFunction();
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            {!networkError ? (
                !loading ? (
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

                        <View style={{ marginTop: 50 }}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => navigation.navigate('ChangePasswordScreen')}
                            >
                                <Text style={{ ...styles.text, fontSize: 13 }}>
                                    Cambiar contraseña
                                </Text>
                            </TouchableOpacity>
                            {allowChangeAlias && (
                                <>
                                    <TouchableOpacity
                                        style={{ ...styles.button, marginTop: 30 }}
                                        onPress={() => navigation.navigate('ChangeAliasScreen')}
                                    >
                                        <Text style={{ ...styles.text, fontSize: 13 }}>
                                            Cambiar seudónimo
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                                        <Text style={stylescom.textGray}>Opción temporal</Text>
                                    </View>
                                </>
                            )}
                        </View>
                        <TouchableOpacity
                            style={{ ...styles.button, marginTop: 30 }}
                            onPress={() => navigation.navigate('BlacklistScreen')}
                        >
                            <Text style={{ ...styles.text, fontSize: 13 }}>
                                Usuarios bloqueados
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ ...styles.button, ...stylescom.delete }}
                            onPress={() => setIsOpenConfirmation(true)}
                        >
                            <Text style={{ ...styles.text, fontSize: 13, ...styles.error }}>
                                Eliminar cuenta
                            </Text>
                        </TouchableOpacity>

                        <ModalConfirmation
                            isOpen={isOpenConfirmation}
                            callback={handleDeleteAccount}
                            setIsOpen={setIsOpenConfirmation}
                            text={
                                '¿Estás seguro de eliminar tu cuenta? Esta acción es irreversible.'
                            }
                            confirmationText={'Eliminar'}
                        />
                    </>
                ) : (
                    <View style={{ ...styles.center, flex: 1 }}>
                        <LoadingAnimated />
                    </View>
                )
            ) : (
                <NetworkErrorFeed callback={loadData} />
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
    textGray: {
        ...styles.textGray,
        fontSize: 12,
        textAlign: 'center',
    },
    delete: {
        borderColor: styles.error.color,
        position: 'absolute',
        bottom: 70,
    },
});
