import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../themes/appTheme';

interface Props {
    isOpen: boolean;
    text: string;
    callback: () => void;
    setIsOpen: (state: boolean) => void;
}

export const ModalConfirmation = ({ isOpen, text, setIsOpen, callback }: Props) => {
    function handleConfirmation() {
        setIsOpen(false);
        callback();
    }
    return (
        <Modal transparent={true} visible={isOpen} animationType="fade">
            <View style={stylescom.back}>
                <View style={stylescom.container}>
                    <View style={{ marginBottom: 25 }}>
                        <Text style={stylescom.title}>
                            Confirmación<Text style={styles.orange}>.</Text>
                        </Text>
                        <Text style={{ ...styles.text, fontSize: 16, textAlign: 'center' }}>
                            {text}
                        </Text>
                    </View>
                    <View style={stylescom.container_buttons}>
                        <TouchableOpacity style={stylescom.button} onPress={() => setIsOpen(false)}>
                            <Text style={styles.h5}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={stylescom.button_confirm}
                            onPress={handleConfirmation}
                        >
                            <Text style={stylescom.confirm}>Cambiar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const stylescom = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingVertical: 30,
        // mHeight: 180,
        maxWidth: '80%',
        backgroundColor: '#ffff',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    back: {
        ...styles.backmodal,
        ...styles.shadow,
        backgroundColor: '#63636315',
    },
    text: {
        ...styles.text,
        fontSize: 16,
        textAlign: 'center',
    },
    container_buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    button: {
        ...styles.button,
        marginHorizontal: 20,
    },
    button_confirm: {
        ...styles.button,
        ...styles.shadow_button,

        marginHorizontal: 20,
        backgroundColor: '#01192E',
    },
    confirm: {
        ...styles.h5,
        color: 'white',
    },
    title: {
        ...styles.h3,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
    },
});
