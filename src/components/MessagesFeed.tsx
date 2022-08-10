import { FlatList } from 'react-native-gesture-handler';
import React from 'react';
import { RootState } from '../store';
import { useAppSelector } from '../store/hooks';
import { ButtonMoreIdeas } from './ButtonMoreIdeas';
import { EmptyState } from './EmptyState';
import { Idea } from './Idea';
import { LoadingAnimated } from './svg/LoadingAnimated';
import { Message } from '../types/store';

interface props {
    messages: Message[];
}

const MessagesFeed = ({ messages }: props) => {
    const { loading, moreMsg } = useAppSelector((state: RootState) => state.messages);
    return (
        <>
            {messages?.length !== 0 ? (
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
                <EmptyState message="Todos buscamos algo, espero que lo encuentres." />
            )}
        </>
    );
};

export default MessagesFeed;
