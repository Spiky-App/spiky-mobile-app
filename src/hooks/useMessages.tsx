import { MessageRequestData } from '../services/models/spikyService';
import { setMessages } from '../store/feature/messages/messagesSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store/index';
import { useEffect, useState } from 'react';
import useSpikyService from './useSpikyService';
import { generateMessageFromMensaje } from '../helpers/message';

export const useMessages = (filter: string, params: MessageRequestData) => {
    const { id: uid } = useAppSelector((state: RootState) => state.user);
    const { messages, draft, univers } = useAppSelector((state: RootState) => state.messages);
    const [loading, setLoading] = useState(false);
    const [moreMsg, setMoreMsg] = useState(true);
    const [networkError, setNetworkError] = useState(false);
    const { getIdeas } = useSpikyService();

    const dispatch = useAppDispatch();

    async function handleGetIdeas(newLoad: boolean, lastMessageId: number | undefined) {
        if (networkError) setNetworkError(false);
        const { messages: mensajes, networkError: networkErrorReturn } = await getIdeas(
            uid,
            filter,
            lastMessageId,
            params
        );
        if (networkErrorReturn) setNetworkError(true);
        const messagesRetrived = mensajes.map((mensaje, index) =>
            generateMessageFromMensaje(mensaje, index)
        );
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
    }

    const fetchMessages = async (newLoad: boolean) => {
        if (draft) {
            params = { draft: draft ? 1 : 0, ...params };
        }
        if (univers != undefined) {
            params = { univers: univers, ...params };
        }
        const lastMessageId =
            messages.length > 0 && !newLoad ? messages[messages.length - 1].id : undefined;
        if (params.search === '' && filter === '/search') {
            dispatch(setMessages([]));
        } else {
            setLoading(true);
            await handleGetIdeas(newLoad, lastMessageId);
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
    }, [params, uid, draft, univers]);

    return {
        fetchMessages,
        moreMsg,
        loading,
        networkError,
    };
};
