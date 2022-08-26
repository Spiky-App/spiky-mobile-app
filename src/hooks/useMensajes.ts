import { useEffect } from 'react';
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
import { Message, University, User } from '../types/store';

export const useMensajes = (params: MessageRequestData = {}) => {
    const dispatch = useAppDispatch();
    const { messages, filter, loading, moreMsg, lastMessageId } = useAppSelector(
        (state: RootState) => state.messages
    );
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const uid = useAppSelector((state: RootState) => state.user.id);

    const fetchMessages = async () => {
        try {
            dispatch(setLoading(true));
            const spikyClient = new SpikyService(config);
            const { request, data: messagesData } = await spikyClient.getMessages(
                uid,
                lastMessageId,
                filter,
                params
            );
            console.info('url:', request.responseURL);
            const { mensajes } = messagesData;
            const messagesRetrived: Message[] = mensajes.map(message => {
                const university: University = {
                    id: message.usuario.id_universidad,
                    shortname: message.usuario.universidad.alias,
                };
                const user: User = {
                    id: message.id_usuario,
                    alias: message.usuario.alias,
                    university,
                };
                return {
                    id: message.id_mensaje,
                    message: message.mensaje,
                    date: message.fecha,
                    favor: message.favor,
                    neutral: message.neutro,
                    against: message.contra,
                    user,
                    reaction_type: message.reacciones[0]?.tipo || 0,
                    id_tracking: message.trackings[0]?.id_tracking,
                    answersNumber: message.num_respuestas,
                    draft: message.draft,
                };
            });
            if (messagesRetrived.length < 10) {
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
        messages,
        loading,
        moreMsg,
        fetchMessages,
    };
};
