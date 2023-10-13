import React, { useState, useEffect } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeftLong, faBan } from '../constants/icons/FontAwesome';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { styles } from '../themes/appTheme';
import { useAppSelector } from '../store/hooks';
import useSpikyService from '../hooks/useSpikyService';
import { RootState } from '../store';
import { UserI } from '../types/services/spiky';
import UniversityTag from '../components/common/UniversityTag';
import { setModalAlert } from '../store/feature/ui/uiSlice';
import { useDispatch } from 'react-redux';

export const BlacklistScreen = () => {
    const navigation = useNavigation<any>();
    const [blacklist, setBlacklist] = useState<UserI[] | undefined>();
    const uid = useAppSelector((state: RootState) => state.user.id);
    const { getBlockedUsers } = useSpikyService();
    const setInfo = async () => {
        const usuarios = await getBlockedUsers(uid);
        setBlacklist(usuarios);
    };
    const { blockUser } = useSpikyService();
    const dispatch = useDispatch();
    const handleUnblockUser = async (user: UserI) => {
        const ok = await blockUser(uid, user.alias, true);
        if (ok) {
            dispatch(setModalAlert({ isOpen: true, text: 'Usuario desbloqueado', icon: faBan }));
            const newBlacklist = blacklist?.filter(b => b.alias !== user.alias);
            setBlacklist(newBlacklist);
        }
    };

    useEffect(() => {
        setInfo();
    }, []);

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
                    Usuarios bloqueados
                    <Text style={styles.orange}>.</Text>
                </Text>
            </View>
            <Text style={{ ...styles.text, fontSize: 12, marginVertical: 30 }}>
                Puedes bloquear a un usuario desde la vista de su perfil.
            </Text>
            {blacklist?.length !== 0 && (
                <View style={(styles.center, { width: '100%', marginVertical: 10 })}>
                    <FlatList
                        data={blacklist}
                        renderItem={({ item }) => (
                            <View
                                style={{
                                    ...styles.flex,
                                    ...styles.shadow,
                                    justifyContent: 'space-between',
                                    marginHorizontal: 10,
                                    marginVertical: 5,
                                    flexDirection: 'row',
                                    backgroundColor: 'white',
                                    padding: 20,
                                }}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ ...styles.text, ...styles.h5 }}>
                                        {item.alias}
                                    </Text>
                                    <UniversityTag id={item.id_universidad} fontSize={13} />
                                </View>
                                <TouchableOpacity
                                    style={{ ...styles.center }}
                                    onPress={() => {
                                        Alert.alert(
                                            '¿Estás seguro que quieres desbloquear a ' +
                                                item.alias +
                                                '?',
                                            'Su contenido se volverá a mostrar en el feed.',
                                            [
                                                {
                                                    text: 'Cancelar',
                                                    onPress: () => {},
                                                    style: 'cancel',
                                                },
                                                {
                                                    text: 'Sí, desbloquear usuario.',
                                                    onPress: () => handleUnblockUser(item),
                                                },
                                            ]
                                        );
                                    }}
                                >
                                    <Text
                                        style={{
                                            ...styles.text,
                                            ...styles.link,
                                            textAlign: 'right',
                                        }}
                                    >
                                        desbloquear
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={item => item.id_usuario + ''}
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={3000}
                        ListFooterComponentStyle={{ marginVertical: 12 }}
                    />
                </View>
            )}
        </BackgroundPaper>
    );
};
