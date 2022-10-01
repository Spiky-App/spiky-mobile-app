import React, { PropsWithChildren, useEffect } from 'react';
import { socketBaseUrl } from '../../constants/config';
import { useSocket } from '../../hooks/useSocket';
import { RootState } from '../../store';
import { addToast } from '../../store/feature/toast/toastSlice';
import { updateNotificationsNumber } from '../../store/feature/user/userSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { StatusType } from '../../types/common';
import { SocketContextProvider } from './Context';

export interface ISocketContextComponentProps extends PropsWithChildren {}
const mensajes = [
    '',
    'reaccionó a tu idea.',
    'respondió a tu idea.',
    'respondió en tu tracking',
    'te mencionó.',
    'reacciono a tu comentario.',
];

const SocketContextComponent: React.FunctionComponent<ISocketContextComponentProps> = props => {
    const { children } = props;
    const dispatch = useAppDispatch();
    const token = useAppSelector((state: RootState) => state.auth.token);
    const uid = useAppSelector((state: RootState) => state.user.id);
    const socket = useSocket(socketBaseUrl, {
        transports: ['websocket'],
        autoConnect: true,
        forceNew: true,
        query: {
            'x-token': token,
        },
    });

    useEffect(() => {
        if (uid) {
            socket.io.opts.query = {
                'x-token': token,
            };
            socket.connect();
        }
    }, [uid]);
    useEffect(() => {
        /** Socket connected */
        socket?.on('connect', () => {
            console.log('connected');
        });

        /** Socket disconnected */
        socket?.on('disconnect', reason => {
            console.log(reason);
        });

        socket?.on('notify', resp => {
            dispatch(updateNotificationsNumber(1));
            dispatch(
                addToast({
                    message: resp.alias + ' ' + mensajes[resp.tipo],
                    type: StatusType.NOTIFICATION,
                })
            );
        });

        /** Connection / reconnection listeners */
        socket?.io.on('reconnect', attempt => {
            console.info('Reconnected on attempt: ' + attempt);
            SendHandshake();
        });

        socket?.io.on('reconnect_attempt', attempt => {
            console.info('Reconnection Attempt: ' + attempt);
        });

        socket?.io.on('reconnect_error', error => {
            console.info('Reconnection error: ' + error);
        });

        socket?.io.on('reconnect_failed', () => {
            console.info('Reconnection failure.');
            dispatch(
                addToast({
                    message:
                        'We are unable to connect you to the chat service.  Please make sure your internet connection is stable or try again later.',
                    type: StatusType.WARNING,
                })
            );
        });
        SendHandshake();
    }, [socket]);

    const SendHandshake = async () => {
        console.info('Sending handshake to server ...');

        socket?.emit('handshake', async () => {
            console.info('User handshake callback message received');
        });
    };

    return <SocketContextProvider value={{ socket }}>{children}</SocketContextProvider>;
};
export default SocketContextComponent;
