import { generateMessageFromMensaje } from '../helpers/message';
import { MessageRequestData } from '../services/models/spikyService';
import SpikyService from '../services/SpikyService';
import { setMessages, setMoreMsg, setLoading } from '../store/feature/messages/messagesSlice';
import { addToast } from '../store/feature/toast/toastSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { StatusType } from '../types/common';
import { Message } from '../types/store';
import { RootState } from '../store/index';
import { useEffect } from 'react';

export const useMessages = (filter: string) => {
    const { id: uid } = useAppSelector((state: RootState) => state.user);
    const { messages } = useAppSelector((state: RootState) => state.messages);
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const dispatch = useAppDispatch();

    const fetchMessages = async (params: MessageRequestData = {}, newLoad: boolean) => {
        const lastMessageId =
            messages.length > 0 && !newLoad ? messages[messages.length - 1].id : undefined;
        dispatch(setLoading(true));
        try {
            const spikyClient = new SpikyService(config);
            const { data: messagesData } = await spikyClient.getMessages(
                uid,
                filter,
                lastMessageId,
                params
            );
            const { mensajes } = messagesData;
            const messagesRetrived: Message[] = mensajes.map((mensaje, index) => {
                return generateMessageFromMensaje(mensaje, index);
            });

            if (newLoad) {
                dispatch(setMessages(messagesRetrived));
            } else {
                dispatch(setMessages([...messages, ...messagesRetrived]));
            }

            if (messagesRetrived.length < 15) {
                dispatch(setMoreMsg(false));
            } else {
                dispatch(setMoreMsg(true));
            }
        } catch (e) {
            console.log(e);
            dispatch(addToast({ message: 'Error cargando mensajes', type: StatusType.WARNING }));
        }
        dispatch(setLoading(false));
    };

    useEffect(() => {
        return () => {
            dispatch(setMessages([]));
        };
    }, []);

    return {
        fetchMessages,
    };
};
