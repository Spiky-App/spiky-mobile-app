import { FlatList } from 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { RootState } from '../store';
import { useAppSelector } from '../store/hooks';
import { EmptyState } from './EmptyState';
import { Idea } from './Idea';
import { LoadingAnimated } from './svg/LoadingAnimated';
import { useMessages } from '../hooks/useMessages';
import { IdeasHeader } from './IdeasHeader';
import { setUniversitiesFilter } from '../store/feature/messages/messagesSlice';
import { useDispatch } from 'react-redux';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface MessageParams {
    alias?: string;
    search?: string;
    hashtag?: string;
}

interface MessagesFeedProp {
    params: MessageParams;
    filter: string;
    title: string;
    myideas: boolean;
    icon: IconDefinition;
}

const MessagesFeed = ({ params, filter, title, myideas = false, icon }: MessagesFeedProp) => {
    const dispatch = useDispatch();
    const { messages } = useAppSelector((state: RootState) => state.messages);
    const { fetchMessages, moreMsg, loading } = useMessages(filter, params);
    const handleMessages = (newLoad: boolean) => {
        fetchMessages(newLoad);
    };
    const loadMore = () => {
        if (moreMsg) handleMessages(false);
    };

    useEffect(() => {
        dispatch(setUniversitiesFilter(undefined));
    }, []);
    return (
        <>
            <IdeasHeader title={title} myideas={myideas} icon={icon} />
            {messages?.length !== 0 ? (
                <FlatList
                    style={{ width: '90%' }}
                    data={messages}
                    renderItem={({ item }) => <Idea idea={item} filter={filter} />}
                    keyExtractor={item => item.id + ''}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={3000}
                    onEndReached={() => {
                        !loading && loadMore();
                    }}
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
