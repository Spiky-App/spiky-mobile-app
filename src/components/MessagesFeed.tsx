import { FlatList } from 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { RootState } from '../store';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { EmptyState } from './EmptyState';
import { Idea } from './Idea';
import { LoadingAnimated } from './svg/LoadingAnimated';
import { useMessages } from '../hooks/useMessages';
import { setMessages } from '../store/feature/messages/messagesSlice';

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
    const dispatch = useAppDispatch();
    const { messages, moreMsg, loading } = useAppSelector((state: RootState) => state.messages);
    const { fetchMessages } = useMessages(filter);

    const handleMessages = (newLoad: boolean) => {
        fetchMessages(params, newLoad);
    };

    const loadMore = () => {
        if (moreMsg) handleMessages(false);
    };

    useEffect(() => {
        if (params.search?.length === 0) {
            dispatch(setMessages([]));
        } else {
            handleMessages(true);
        }
    }, [params.alias, params.search]);

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
