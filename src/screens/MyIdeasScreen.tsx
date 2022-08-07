import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { IdeasHeader } from '../components/IdeasHeader';
import { Idea } from '../components/Idea';

import { FloatButton } from '../components/FloatButton';
import { EmptyState } from '../components/EmptyState';
import { ButtonMoreIdeas } from '../components/ButtonMoreIdeas';
import { LoadingAnimated } from '../components/svg/LoadingAnimated';
import { setFilter } from '../store/feature/messages/messagesSlice';
import { useAppDispatch } from '../store/hooks';
import { useMensajes } from '../hooks/useMensajes';

export const MyIdeasScreen = () => {
    const dispatch = useAppDispatch();

    useEffect(function () {
        dispatch(setFilter('/user'));
        console.log('filter: /user');
    }, []);
    const { messages, loading, moreMsg } = useMensajes();

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <IdeasHeader title="Mis ideas" myideas={true} />

            {messages && (
                <FlatList
                    style={{ width: '90%' }}
                    data={messages}
                    renderItem={({ item }) => <Idea idea={item} />}
                    keyExtractor={item => item.id + ''}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={
                        loading ? LoadingAnimated : moreMsg ? ButtonMoreIdeas : <></>
                    }
                />
            )}
            {loading ? <LoadingAnimated /> : <EmptyState message="¿Ya sabes que decir?" />}
            <FloatButton />
        </BackgroundPaper>
    );
};
