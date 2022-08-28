import React, { useEffect } from 'react';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { IdeasHeader } from '../components/IdeasHeader';
import { FloatButton } from '../components/FloatButton';
import { setFilter } from '../store/feature/messages/messagesSlice';
import { useAppDispatch } from '../store/hooks';
import MessagesFeed from '../components/MessagesFeed';

export const MyIdeasScreen = () => {
    const dispatch = useAppDispatch();

    useEffect(function () {
        dispatch(setFilter('/user'));
    }, []);

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <IdeasHeader title="Mis ideas" myideas={true} />
            <MessagesFeed />
            <FloatButton />
        </BackgroundPaper>
    );
};
