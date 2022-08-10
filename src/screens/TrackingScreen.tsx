import React, { useEffect } from 'react';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { IdeasHeader } from '../components/IdeasHeader';
import { FloatButton } from '../components/FloatButton';
import { useMensajes } from '../hooks/useMensajes';
import { useAppDispatch } from '../store/hooks';
import { setFilter } from '../store/feature/messages/messagesSlice';
import MessagesFeed from '../components/MessagesFeed';

export const TrackingScreen = () => {
    const dispatch = useAppDispatch();

    useEffect(function () {
        dispatch(setFilter('/tracking'));
    }, []);
    const { messages, loading, moreMsg } = useMensajes();

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <IdeasHeader title="Siguiendo" />
            <MessagesFeed messages={messages} />
            <FloatButton />
        </BackgroundPaper>
    );
};
