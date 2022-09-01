import { useCallback, useEffect, useState } from 'react';
import SpikyService from '../services/SpikyService';
import { RootState } from '../store';
import { addToast } from '../store/feature/toast/toastSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { StatusType } from '../types/common';
import { Comment } from '../types/store';

function useSpikyService() {
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const user = useAppSelector((state: RootState) => state.user);
    const dispatch = useAppDispatch();
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
            } catch {
                dispatch(
                    addToast({ message: 'Error creando respuesta', type: StatusType.WARNING })
                );
            }
            return messageComment;
        },
        [service, user]
    );

    return { createMessageComment };
}

export default useSpikyService;
