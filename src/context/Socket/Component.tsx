import React, { PropsWithChildren, useEffect } from 'react';
import { Vibration } from 'react-native';
import { socketBaseUrl } from '../../constants/config';
import { useSocket } from '../../hooks/useSocket';
import useSpikyService from '../../hooks/useSpikyService';
import { RootState } from '../../store';
import { updateLastChatMsgConversation } from '../../store/feature/chats/chatsSlice';
import { addToast } from '../../store/feature/toast/toastSlice';
import {
    increaseNewChatMessagesNumber,
    updateNotificationsNumber,
} from '../../store/feature/user/userSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { StatusType } from '../../types/common';
import { ChatMessage, Conversation } from '../../types/store';
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
    const { getPendingNotifications } = useSpikyService();
    const uid = useAppSelector((state: RootState) => state.user.id);
    const { activeConversationId } = useAppSelector((state: RootState) => state.chats);
    const { socket, connectSocket, disconnectSocket } = useSocket(socketBaseUrl);

    useEffect(() => {
        if (uid) connectSocket();
    }, [uid, connectSocket]);

    useEffect(() => {
        if (!uid) disconnectSocket();
    }, [uid, disconnectSocket]);

    useEffect(() => {
        socket?.removeAllListeners();
        /** Socket connected */
        socket?.on('connect', () => {
            console.log('connected');
            getPendingNotifications();
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

    useEffect(() => {
        socket?.removeListener('newChatMsgWithReply');
        socket?.on('newChatMsgWithReply', (resp: { conver: Conversation }) => {
            const { conver } = resp;
            if (activeConversationId !== conver.id) {
                dispatch(increaseNewChatMessagesNumber());
            }
        });

        socket?.removeListener('newChatMsg');
        socket?.on('newChatMsg', (resp: { chatmsg: ChatMessage }) => {
            const { chatmsg } = resp;
            if (activeConversationId !== chatmsg.conversationId) {
                dispatch(increaseNewChatMessagesNumber());
                dispatch(updateLastChatMsgConversation({ chatMsg: chatmsg, newMsg: true }));
            }
        });

        socket?.removeListener('sendNudge');
        socket?.on('sendNudge', (resp: { converId: number; nickname: string }) => {
            const { converId } = resp;
            Vibration.vibrate();
            if (activeConversationId !== converId) {
                dispatch(
                    addToast({
                        message: '@' + resp.nickname + ' te ha enviado un zumbido',
                        type: StatusType.NUDGE,
                    })
                );
            }
        });
    }, [socket, activeConversationId]);

    const SendHandshake = async () => {
        console.info('Sending handshake to server ...');

        socket?.emit('handshake', async () => {
            console.info('User handshake callback message received');
        });
    };

    return <SocketContextProvider value={{ socket }}>{children}</SocketContextProvider>;
};
export default SocketContextComponent;
