import { useEffect } from 'react';
import SpikyService from '../services/SpikyService';
import { RootState } from '../store';
import { setMessages } from '../store/feature/messages/messagesSlice';
import { addToast } from '../store/feature/toast/toastSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { StatusType } from '../types/common';
import { Message, University, User } from '../types/store';

export const useMensajes = () => {
    const dispatch = useAppDispatch();
    const { messages, filter, loading, moreMsg } = useAppSelector(
        (state: RootState) => state.messages
    );
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const uid = useAppSelector((state: RootState) => state.user.id);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const spikyClient = new SpikyService(config);
                const messagesResponse = await spikyClient.getMessages(uid, 11, filter);
                const { data: messagesData } = messagesResponse;
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
                        reaction_type: message.reacciones[0]?.tipo ? message.reacciones[0].tipo : 0,
                        id_tracking: message.trackings[0]?.id_tracking,
                        answersNumber: message.num_respuestas,
                        draft: message.draft,
                    };
                });
                dispatch(setMessages(messagesRetrived));
            } catch {
                dispatch(
                    addToast({ message: 'Error cargando mensajes', type: StatusType.WARNING })
                );
            }
        };
        fetchMessages();
    });
    return {
        filter,
        messages,
        loading,
        moreMsg,
    };
};
