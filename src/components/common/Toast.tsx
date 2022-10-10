import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RootState } from '../../store';
import { useAppSelector } from '../../store/hooks';
import { StatusType } from '../../types/common';
import { ModalNotification } from '../ModalNotification';
import ToastMessage from './toast/ToastMessage';

interface Props {
    children: JSX.Element;
}

function Toast({ children }: Props) {
    const toastQueue = useAppSelector((state: RootState) => state.toast.queue);
    const [modalNotif, setModalNotif] = useState(false);
    const navigation = useNavigation<any>();
    return (
        <>
            {children}
            <View style={styles.stack}>
                {toastQueue.map((toast, i) => (
                    <TouchableOpacity
                        key={i}
                        onPress={() => {
                            if (toast.type === StatusType.NOTIFICATION) {
                                setModalNotif(true);
                            } else if (toast.type === StatusType.NUDGE) {
                                navigation.navigate('ConnectionsScreen');
                            }
                        }}
                    >
                        <ToastMessage message={toast.message} status={toast.type} />
                    </TouchableOpacity>
                ))}
            </View>
            <ModalNotification modalNotif={modalNotif} setModalNotif={setModalNotif} />
        </>
    );
}

export default Toast;

const styles = StyleSheet.create({
    stack: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        justifyContent: 'center',
        top: 70,
        width: '100%',
        paddingHorizontal: 10,
        paddingTop: 30,
    },
});
