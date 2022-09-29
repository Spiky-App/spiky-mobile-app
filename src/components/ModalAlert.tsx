import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useRef, useEffect } from 'react';
import { Modal, StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import { RootState } from '../store';
import { setModalAlert } from '../store/feature/ui/uiSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { styles } from '../themes/appTheme';
import { faCircleExclamation } from '../constants/icons/FontAwesome';

export const ModalAlert = () => {
    const { isOpen, text, icon, color } = useAppSelector((state: RootState) => state.ui.modalAlert);
    const dispatch = useAppDispatch();
    const timeoutRef = useRef(0);

    useEffect(() => {
        if (isOpen) {
            timeoutRef.current = setTimeout(() => dispatch(setModalAlert({ isOpen: false })), 2000);
        }
    }, [isOpen]);

    return (
        <Modal transparent={true} visible={isOpen} animationType="fade">
            <TouchableWithoutFeedback onPressOut={() => dispatch(setModalAlert({ isOpen: false }))}>
                <View style={stylescom.back}>
                    <View
                        style={{
                            ...stylescom.container,
                            ...styles.center,
                            paddingHorizontal: 20,
                            paddingVertical: 5,
                        }}
                    >
                        <FontAwesomeIcon
                            icon={icon || faCircleExclamation}
                            color={color}
                            size={60}
                        />
                        <Text style={stylescom.text}>{text}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const stylescom = StyleSheet.create({
    container: {
        height: 180,
        width: 180,
        backgroundColor: '#ffff',
        borderRadius: 10,
    },
    back: {
        ...styles.backmodal,
        ...styles.shadow,
        backgroundColor: '#63636315',
    },
    text: {
        ...styles.text,
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center',
    },
});
