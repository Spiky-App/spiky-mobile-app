import { generateMessageFromMensaje } from '../helpers/message';
import { MessageRequestData } from '../services/models/spikyService';
import SpikyService from '../services/SpikyService';
import { setMessages } from '../store/feature/messages/messagesSlice';
import { addToast } from '../store/feature/toast/toastSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { StatusType } from '../types/common';
import { Message } from '../types/store';
import { RootState } from '../store/index';
import { useEffect, useState } from 'react';

export const useMessages = (filter: string, params: MessageRequestData) => {
    const { id: uid } = useAppSelector((state: RootState) => state.user);
    const { messages, draft } = useAppSelector((state: RootState) => state.messages);
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const [loading, setLoading] = useState(false);
    const [moreMsg, setMoreMsg] = useState(true);

    const dispatch = useAppDispatch();

    const fetchMessages = async (newLoad: boolean) => {
        if (draft) {
            params = { draft: draft ? 1 : 0, ...params };
        }
        const lastMessageId =
            messages.length > 0 && !newLoad ? messages[messages.length - 1].id : undefined;

        if (params.search === '' && filter === '/search') {
            dispatch(setMessages([]));
        } else {
            setLoading(true);
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
                    setMoreMsg(false);
                } else {
                    setMoreMsg(true);
                }
            } catch (e) {
                console.log(e);
                dispatch(
                    addToast({ message: 'Error cargando mensajes', type: StatusType.WARNING })
                );
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        if (uid) {
            fetchMessages(true);
        }
        return () => {
            dispatch(setMessages([]));
        };
    }, [params, uid, draft]);

    return {
        fetchMessages,
        moreMsg,
        loading,
    };
};
