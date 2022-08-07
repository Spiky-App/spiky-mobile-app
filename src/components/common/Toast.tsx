import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RootState } from '../../store';
import { useAppSelector } from '../../store/hooks';
import ToastMessage from './toast/ToastMessage';

interface Props {
    children: JSX.Element;
}

function Toast({ children }: Props) {
    const toastQueue = useAppSelector((state: RootState) => state.toast.queue);
    return (
        <>
            {children}
            <View style={styles.stack}>
                {toastQueue.map(toast => (
                    <ToastMessage key={toast.message} message={toast.message} status={toast.type} />
                ))}
            </View>
        </>
    );
}

export default Toast;

const styles = StyleSheet.create({
    stack: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingHorizontal: 40,
        paddingBottom: 30,
    },
});
