import React from 'react';
import { FlatList } from 'react-native';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { ButtonMoreIdeas } from '../components/ButtonMoreIdeas';
import { EmptyState } from '../components/EmptyState';
import { FloatButton } from '../components/FloatButton';
import { Idea } from '../components/Idea';
import { IdeasHeader } from '../components/IdeasHeader';
import { LoadingAnimated } from '../components/svg/LoadingAnimated';
import { RootState } from '../store';
import { useAppSelector } from '../store/hooks';

export const CommunityScreen = () => {
    const messages = useAppSelector((state: RootState) => state.messages.messages);
    const loading = false;
    const moreMsg = true;
    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <IdeasHeader title="Comunidad" />

            {messages ? (
                <FlatList
                    style={{ width: '90%' }}
                    data={messages}
                    renderItem={({ item }) => <Idea idea={item} />}
                    keyExtractor={item => item.id + ''}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={
                        loading ? LoadingAnimated : moreMsg ? ButtonMoreIdeas : <></>
                    }
                    ListFooterComponentStyle={{ marginVertical: 12 }}
                />
            ) : loading ? (
                <LoadingAnimated />
            ) : (
                <EmptyState message="Cuestión de tiempo de que alguien hable." />
            )}
            <FloatButton />
        </BackgroundPaper>
    );
};
