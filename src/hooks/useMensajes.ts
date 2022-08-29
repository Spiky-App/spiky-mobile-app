import { useEffect } from 'react';
import { generateMessageFromMensaje } from '../helpers/message';
import { MessageRequestData } from '../services/models/spikyService';
import SpikyService from '../services/SpikyService';
import { RootState } from '../store';
import {
    setMessages,
    setLoading,
    setLastMessageId,
    setMoreMsg,
} from '../store/feature/messages/messagesSlice';
import { addToast } from '../store/feature/toast/toastSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { StatusType } from '../types/common';
import { Message } from '../types/store';

export const useMensajes = (params: MessageRequestData = {}) => {
    const dispatch = useAppDispatch();
    const { messages, loading, moreMsg, lastMessageId, filter } = useAppSelector(
        (state: RootState) => state.messages
    );
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const { id: uid } = useAppSelector((state: RootState) => state.user);

    const fetchMessages = async () => {
        try {
            dispatch(setLoading(true));
            const spikyClient = new SpikyService(config);
            const { data: messagesData } = await spikyClient.getMessages(
                uid,
                lastMessageId,
                filter,
                params
            );
            const { mensajes } = messagesData;
            const messagesRetrived: Message[] = mensajes.map((mensaje, index) => {
                return generateMessageFromMensaje(mensaje, index);
            });
            if (messagesRetrived.length < 15) {
                dispatch(setMoreMsg(false));
            } else {
                dispatch(setMoreMsg(true));
            }

            /*
                Explanation:
                + we might have an empty result so messagesRetrived[messagesRetrived.length - 1].id would be undefined, that's why we require a lenght > 0
                + also, in api/mensajes/search we return all results (i'm not sure) 
            */
            if (messagesRetrived.length && !params.search) {
                dispatch(setLastMessageId(messagesRetrived[messagesRetrived.length - 1].id));
                dispatch(setMessages([...messages, ...messagesRetrived]));
            }
            if (params.search) {
                dispatch(setMessages(messagesRetrived));
            }
            dispatch(setLoading(false));
        } catch (e) {
            console.log(e);
            dispatch(addToast({ message: 'Error cargando mensajes', type: StatusType.WARNING }));
        }
    };
    useEffect(() => {
        if (uid && config?.headers?.['x-token']) {
            fetchMessages();
        }
        return () => {
            dispatch(setLastMessageId(undefined));
            dispatch(setMessages([]));
        };
    }, [config, uid, filter]);

    return {
        filter,
        loading,
        moreMsg,
        fetchMessages,
    };
};
