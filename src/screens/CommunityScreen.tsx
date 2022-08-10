import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { ButtonMoreIdeas } from '../components/ButtonMoreIdeas';
import { EmptyState } from '../components/EmptyState';
import { FloatButton } from '../components/FloatButton';
import { Idea } from '../components/Idea';
import { IdeasHeader } from '../components/IdeasHeader';
import MessagesFeed from '../components/MessagesFeed';
import { LoadingAnimated } from '../components/svg/LoadingAnimated';
import { useMensajes } from '../hooks/useMensajes';
import { setFilter } from '../store/feature/messages/messagesSlice';
import { useAppDispatch } from '../store/hooks';

export const CommunityScreen = () => {
    const dispatch = useAppDispatch();
    useEffect(function () {
        dispatch(setFilter(''));
    }, []);
    const { messages, loading, moreMsg } = useMensajes();

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <IdeasHeader title="Comunidad" />
            <MessagesFeed messages={messages} />
            <FloatButton />
        </BackgroundPaper>
    );
};
