import { useEffect } from 'react';
import { MessageRequestData } from '../services/models/spikyService';
import SpikyService from '../services/SpikyService';
import { RootState } from '../store';
import { setMessages, setLoading } from '../store/feature/messages/messagesSlice';
import { addToast } from '../store/feature/toast/toastSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { StatusType } from '../types/common';
import { Message, University, User } from '../types/store';

export const useMensajes = (params: MessageRequestData = {}) => {
    const dispatch = useAppDispatch();
    const { messages, filter, loading, moreMsg } = useAppSelector(
        (state: RootState) => state.messages
    );
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const uid = useAppSelector((state: RootState) => state.user.id);

    const fetchMessages = async () => {
        try {
            const spikyClient = new SpikyService(config);
            dispatch(setLoading(true));
            const { request, data: messagesData } = await spikyClient.getMessages(
                uid,
                11,
                filter,
                params
            );
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
            dispatch(setMessages(messagesRetrived));
            dispatch(setLoading(false));
        } catch {
            dispatch(addToast({ message: 'Error cargando mensajes', type: StatusType.WARNING }));
        }
    };
    useEffect(() => {
        fetchMessages();
    }, [config, uid, filter]);

    return {
        filter,
        messages,
        loading,
        moreMsg,
        fetchMessages,
    };
};
