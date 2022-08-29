import { FlatList } from 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { RootState } from '../store';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { EmptyState } from './EmptyState';
import { Idea } from './Idea';
import { LoadingAnimated } from './svg/LoadingAnimated';
import { useMensajes } from '../hooks/useMensajes';
import { setLastMessageId, setMessages } from '../store/feature/messages/messagesSlice';
interface MessageParams {
    alias?: string;
    search?: string;
    hashtag?: string;
    univer?: number;
    draft?: boolean;
    cantidad?: number;
}

const MessagesFeed = (params: MessageParams) => {
    const dispatch = useAppDispatch();
    const { moreMsg, fetchMessages } = useMensajes({
        ...params,
    });
    const { loading, messages } = useAppSelector((state: RootState) => state.messages);
    useEffect(() => {
        dispatch(setMessages([]));
        dispatch(setLastMessageId(undefined));
        fetchMessages();
    }, [params]);

    const loadMore = () => {
        if (moreMsg) fetchMessages();
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
