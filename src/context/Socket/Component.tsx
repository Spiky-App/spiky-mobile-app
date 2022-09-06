import React, { PropsWithChildren, useEffect, useReducer } from 'react';
import { socketBaseUrl } from '../../constants/config';
import { useSocket } from '../../hooks/useSocket';
import { RootState } from '../../store';
import { addToast } from '../../store/feature/toast/toastSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { StatusType } from '../../types/common';
import { SocketReducer, defaultSocketContextState, SocketContextProvider } from './Context';

export interface ISocketContextComponentProps extends PropsWithChildren {}

const SocketContextComponent: React.FunctionComponent<ISocketContextComponentProps> = props => {
    const { children } = props;
    const dispatch = useAppDispatch();
    const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState);
    const token = useAppSelector((state: RootState) => state.auth.token);
    const socket = useSocket(socketBaseUrl, {
        transports: ['websocket'],
        autoConnect: true,
        forceNew: true,
        query: {
            'x-token': token,
        },
    });

    useEffect(() => {
        socket.io.opts.query = {
            'x-token': token,
        };
        socket.connect();
        SocketDispatch({ type: 'update_socket', payload: socket });
        StartListeners();
        SendHandshake();
    }, [token]);

    const StartListeners = () => {
        /** Socket connected */
        socket?.on('connect', () => {
            console.log('connected');
        });

        /** Socket disconnected */
        socket?.on('disconnect', reason => {
            console.log(reason);
        });

        /** Get conversations */
        socket?.on('get-convers', convers => {
            console.log(convers);
        });

        /** Get active chat messages */
        socket?.on('activechat', resp => {
            console.log(resp);
        });
        /** Starting up anew conversation */
        socket?.on('add-conver', resp => {
            console.log(resp);
        });
        /** Send a new message in conversation */
        socket?.on('chatmsg', resp => {
            console.log(resp);
        });
        socket?.on('notify', resp => {
            console.log(resp);
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
    };
    const SendHandshake = async () => {
        console.info('Sending handshake to server ...');

        socket?.emit('handshake', async () => {
            console.info('User handshake callback message received');
        });
    };

    return (
        <SocketContextProvider value={{ SocketState, SocketDispatch }}>
            {children}
        </SocketContextProvider>
    );
};
export default SocketContextComponent;
