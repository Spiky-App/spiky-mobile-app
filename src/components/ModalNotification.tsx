import React from 'react';
import {
    Modal,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    Text,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { notificaciones } from '../data/notificaciones';
import { styles } from '../themes/appTheme';
import { Notification } from './Notification';

interface Props {
    setModalNotif: (value: boolean) => void;
    modalNotif: boolean;
}

export const ModalNotification = ({ modalNotif, setModalNotif }: Props) => {
    const loading = false;

    return (
        <Modal animationType="fade" visible={modalNotif} transparent={true}>
            <TouchableWithoutFeedback onPress={() => setModalNotif(false)}>
                <View style={styles.backmodal}>
                    <TouchableWithoutFeedback>
                        <View
                            style={{
                                ...stylescom.container,
                                paddingHorizontal: 25,
                                paddingVertical: 15,
                            }}
                        >
                            <View style={{ ...styles.flex, justifyContent: 'space-between' }}>
                                <Text style={{ ...styles.text, ...styles.h3 }}>
                                    Notificaciones
                                    <Text style={styles.orange}>.</Text>
                                </Text>

                                <TouchableOpacity style={styles.center} onPress={() => {}}>
                                    <Text
                                        style={{
                                            ...styles.text,
                                            ...styles.link,
                                            textAlign: 'right',
                                        }}
                                    >
                                        Limpiar
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View
                                style={{
                                    marginHorizontal: 5,
                                    marginTop: 20,
                                    marginBottom: 35,
                                    flex: 1,
                                }}
                            >
                                {loading ? (
                                    <Text>Cargando...</Text>
                                ) : notificaciones?.length !== 0 ? (
                                    <FlatList
                                        data={notificaciones}
                                        renderItem={({ item }) => <Notification item={item} />}
                                        keyExtractor={item => item.id_notificacion + ''}
                                        showsVerticalScrollIndicator={false}
                                    />
                                ) : (
                                    <View style={{ ...styles.center, flex: 1 }}>
                                        <Text
                                            style={{
                                                ...styles.text,
                                                ...styles.textGrayPad,
                                                textAlign: 'center',
                                            }}
                                        >
                                            No tienes notificaciones.
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const stylescom = StyleSheet.create({
    container: {
        height: 360,
        width: 300,
        backgroundColor: '#ffff',
        borderRadius: 5,
    },
});
