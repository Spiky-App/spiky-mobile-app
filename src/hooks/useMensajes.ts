import { useEffect } from 'react';
import { generateMessageFromMensaje } from '../helpers/message';
import { MessageRequestData } from '../services/models/spikyService';
import SpikyService from '../services/SpikyService';
import { RootState } from '../store';
import { setMessages, setLoading } from '../store/feature/messages/messagesSlice';
import { addToast } from '../store/feature/toast/toastSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { StatusType } from '../types/common';
import { Message, User } from '../types/store';

export const useMensajes = (params: MessageRequestData = {}) => {
    const dispatch = useAppDispatch();
    const { messages, filter, loading, moreMsg } = useAppSelector(
        (state: RootState) => state.messages
    );
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const { id: uid } = useAppSelector((state: RootState) => state.user);

    const fetchMessages = async () => {
        try {
            const spikyClient = new SpikyService(config);
            dispatch(setLoading(true));
            const { data: messagesData } = await spikyClient.getMessages(uid, 11, params, filter);
            const { mensajes } = messagesData;

            const messagesRetrived: Message[] = mensajes.map(mensaje => {
                const user: User = {
                    id: mensaje.id_usuario,
                    nickname: mensaje.usuario.alias,
                    university: {
                        shortname: mensaje.usuario.universidad.alias,
                    },
                };
                return generateMessageFromMensaje(mensaje, user);
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
