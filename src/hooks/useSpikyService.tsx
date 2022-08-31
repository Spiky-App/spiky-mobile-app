import { useCallback, useEffect, useState } from 'react';
import SpikyService from '../services/SpikyService';
import { RootState } from '../store';
import { addToast } from '../store/feature/toast/toastSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { StatusType } from '../types/common';
import { MessageComment } from '../types/store';

function useSpikyService() {
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const user = useAppSelector((state: RootState) => state.user);
    const dispatch = useAppDispatch();
    const [service, setService] = useState<SpikyService>(new SpikyService(config));

    useEffect(() => {
        console.log(config);
        setService(new SpikyService(config));
    }, [config]);

    const createMessageComment = useCallback(
        async (
            messageId: number,
            uid: number,
            comment: string
        ): Promise<MessageComment | undefined> => {
            let messageComment: MessageComment | undefined = undefined;
            try {
                const { data } = await service.createMessageComment(messageId, uid, comment);
                const { respuesta } = data;
                messageComment = {
                    comment: respuesta.respuesta,
                    date: respuesta.fecha,
                    id: respuesta.id_respuesta,
                    messageId: respuesta.id_mensaje,
                    user: {
                        id: user.id,
                        nickname: user.nickname,
                        university: {
                            shortname: user.university,
                        },
                    },
                };
            } catch {
                dispatch(
                    addToast({ message: 'Error creando respuesta', type: StatusType.WARNING })
                );
            }
            return messageComment;
        },
        [service, user]
    );

    const getMessageComments = useCallback(async (messageId: number) => {
        let messageComments: MessageComment[] | undefined = undefined;
        try {
            const { data } = await service.getMessageComments(messageId);
            const { resp } = data;
            messageComments = resp.map<MessageComment>(messageComment => ({
                comment: messageComment.respuesta,
                date: messageComment.fecha,
                id: messageComment.id_respuesta,
                messageId: messageComment.id_mensaje,
                user: {
                    id: user.id,
                    nickname: user.nickname,
                    university: {
                        shortname: user.university,
                    },
                },
            }));
        } catch (error) {
            dispatch(
                addToast({ message: 'Error obteniendo respuestas', type: StatusType.WARNING })
            );
        }
        return messageComments;
    }, []);

    return { createMessageComment, getMessageComments };
}

export default useSpikyService;
