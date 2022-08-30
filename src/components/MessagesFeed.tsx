import { FlatList } from 'react-native-gesture-handler';
import React from 'react';
import { RootState } from '../store';
import { useAppSelector } from '../store/hooks';
import { EmptyState } from './EmptyState';
import { Idea } from './Idea';
import { LoadingAnimated } from './svg/LoadingAnimated';
import { useMessages } from '../hooks/useMessages';

interface MessageParams {
    alias?: string;
    search?: string;
    hashtag?: string;
    univer?: number[];
    draft?: boolean;
    cantidad?: number;
}

interface MessagesFeedProp {
    params: MessageParams;
    filter: string;
}

const MessagesFeed = ({ params = {}, filter }: MessagesFeedProp) => {
    const { messages } = useAppSelector((state: RootState) => state.messages);
    const { fetchMessages, moreMsg, loading } = useMessages(filter, params);

    const handleMessages = (newLoad: boolean) => {
        fetchMessages(newLoad);
    };

    const loadMore = () => {
        if (moreMsg) handleMessages(false);
    };

    return (
        <>
            {messages?.length !== 0 ? (
                <FlatList
                    style={{ width: '90%' }}
                    data={messages}
                    renderItem={({ item, index }) => <Idea idea={item} index={index} />}
                    keyExtractor={item => item.id + ''}
                    showsVerticalScrollIndicator={false}
                    onEndReached={loadMore}
                    ListFooterComponent={loading ? LoadingAnimated : <></>}
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
