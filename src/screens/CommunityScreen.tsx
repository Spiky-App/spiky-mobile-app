import React, { useEffect } from 'react';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { FloatButton } from '../components/FloatButton';
import { IdeasHeader } from '../components/IdeasHeader';
import MessagesFeed from '../components/MessagesFeed';
import { useMensajes } from '../hooks/useMensajes';
import { setFilter } from '../store/feature/messages/messagesSlice';
import { useAppDispatch } from '../store/hooks';

export const CommunityScreen = () => {
    const dispatch = useAppDispatch();
    useEffect(function () {
        dispatch(setFilter(''));
    }, []);
    const { messages, moreMsg, fetchMessages } = useMensajes();

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <IdeasHeader title="Comunidad" />
            <MessagesFeed
                messages={messages}
                loadMore={() => {
                    if (moreMsg) fetchMessages();
                }}
            />
            <FloatButton />
        </BackgroundPaper>
    );
};
