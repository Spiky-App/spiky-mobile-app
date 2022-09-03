import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import SpikyService from '../services/SpikyService';
import { RootState } from '../store';
import { addToast } from '../store/feature/toast/toastSlice';
import { setModalAlert } from '../store/feature/ui/uiSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { StatusType } from '../types/common';
import { Comment, Message } from '../types/store';
import { faFlag, faThumbtack } from '../constants/icons/FontAwesome';
import { setMessages } from '../store/feature/messages/messagesSlice';

function useSpikyService() {
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const user = useAppSelector((state: RootState) => state.user);
    const messages = useAppSelector((state: RootState) => state.messages.messages);
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const [service, setService] = useState<SpikyService>(new SpikyService(config));

    useEffect(() => {
        setService(new SpikyService(config));
    }, [config]);

    const createMessageComment = useCallback(
        async (messageId: number, uid: number, comment: string): Promise<Comment | undefined> => {
            let messageComment: Comment | undefined = undefined;
            try {
                const { data } = await service.createMessageComment(messageId, uid, comment);
                const { respuesta } = data;
                messageComment = {
                    id: respuesta.id_respuesta,
                    comment: respuesta.respuesta,
                    date: respuesta.fecha,
                    messageId: respuesta.id_mensaje,
                    user: {
                        id: user.id,
                        nickname: user.nickname,
                        university: {
                            shortname: user.university,
                        },
                    },
                    favor: 0,
                    against: 0,
                };
                const messagesUpdated = messages.map(msg => {
                    return msg.id === messageId
                        ? { ...msg, answersNumber: msg.answersNumber + 1 }
                        : msg;
                });
                dispatch(setMessages(messagesUpdated));
            } catch {
                dispatch(
                    addToast({ message: 'Error creando respuesta', type: StatusType.WARNING })
                );
            }
            return messageComment;
        },
        [service, user]
    );

    const createReportIdea = async (
        messageId: number,
        reportReason: string,
        onChange: (
            stateUpdated: Partial<{
                reportReason: string;
            }>
        ) => void
    ) => {
        try {
            const response = await service.createReportIdea(user.id, messageId, reportReason);
            const { data } = response;
            const { msg } = data;
            onChange({ reportReason: '' });
            navigation.goBack();
            dispatch(setModalAlert({ isOpen: true, text: msg, icon: faFlag }));
        } catch (error) {
            console.log(error);
            onChange({ reportReason: '' });
            navigation.goBack();
            dispatch(addToast({ message: 'Error al reportar', type: StatusType.WARNING }));
        }
    };

    const createTracking = async (messageId: number) => {
        const response = await service.createTracking(user.id, messageId);
        const { data } = response;
        const { id_tracking } = data;

        const messagesUpdated = messages.map(msg => {
            if (msg.id === messageId) {
                return { ...msg, messageTrackingId: id_tracking };
            } else {
                return msg;
            }
        });
        dispatch(
            setModalAlert({
                isOpen: true,
                text: 'Tracking activado',
                color: '#FC702A',
                icon: faThumbtack,
            })
        );
        dispatch(setMessages(messagesUpdated));
        return id_tracking;
    };

    const deleteTracking = async (messageId: number, filter?: string) => {
        await service.deleteTracking(messageId);

        let messagesUpdated: Message[];

        if (filter === '/tracking') {
            messagesUpdated = messages.filter(msg => msg.id !== messageId);
        } else {
            messagesUpdated = messages.map(msg => {
                if (msg.id === messageId) {
                    return { ...msg, messageTrackingId: undefined };
                } else {
                    return msg;
                }
            });
        }

        dispatch(setModalAlert({ isOpen: true, text: 'Tracking desactivado', icon: faThumbtack }));
        dispatch(setMessages(messagesUpdated));
    };

    return { createMessageComment, createReportIdea, createTracking, deleteTracking };
}

export default useSpikyService;
