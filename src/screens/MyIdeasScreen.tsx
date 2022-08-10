import React, { useEffect } from 'react';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { IdeasHeader } from '../components/IdeasHeader';
import { FloatButton } from '../components/FloatButton';
import { setFilter } from '../store/feature/messages/messagesSlice';
import { useAppDispatch } from '../store/hooks';
import { useMensajes } from '../hooks/useMensajes';
import MessagesFeed from '../components/MessagesFeed';

export const MyIdeasScreen = () => {
    const dispatch = useAppDispatch();

    useEffect(function () {
        dispatch(setFilter('/user'));
    }, []);
    const { messages } = useMensajes();

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <IdeasHeader title="Mis ideas" myideas={true} />

            <MessagesFeed messages={messages} />
            <FloatButton />
        </BackgroundPaper>
    );
};
