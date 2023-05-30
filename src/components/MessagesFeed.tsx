import { FlatList, View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RootState } from '../store';
import { useAppSelector } from '../store/hooks';
import { EmptyState } from './EmptyState';
import { Idea } from './Idea';
import { LoadingAnimated } from './svg/LoadingAnimated';
import { useMessages } from '../hooks/useMessages';
import { IdeasHeader } from './IdeasHeader';
import { setUniversitiesFilter } from '../store/feature/messages/messagesSlice';
import { useDispatch } from 'react-redux';
import { RefreshControl } from 'react-native';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { styles } from '../themes/appTheme';
import NetworkErrorFeed from './NetworkErrorFeed';
import { TopicQuestion } from '../types/store';

interface MessageParams {
    alias?: string;
    search?: string;
    hashtag?: string;
    id_topic_question?: number;
}

interface MessagesFeedProp {
    params: MessageParams;
    filter: string;
    title: string;
    myideas: boolean;
    profile?: boolean;
    icon: IconDefinition;
    emptyTitle: string;
    topicQuestion?: TopicQuestion;
}

export const MessagesFeed = ({
    params,
    filter,
    title,
    myideas = false,
    profile,
    icon,
    emptyTitle,
    topicQuestion,
}: MessagesFeedProp) => {
    const dispatch = useDispatch();
    const { messages } = useAppSelector((state: RootState) => state.messages);
    const { fetchMessages, moreMsg, loading, networkError, mood } = useMessages(filter, params);
    const [isFetching, setIsFetching] = useState(false);

    const onRefresh = async () => {
        setIsFetching(true);
        fetchMessages(true);
        setIsFetching(false);
    };
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
            <IdeasHeader
                title={title}
                myideas={myideas}
                icon={icon}
                profile={profile}
                topicQuestion={topicQuestion}
                blocked_user={params.alias ? params.alias : ''}
            />
            {messages?.length !== 0 && !networkError && (
                <FlatList
                    style={{ width: '100%' }}
                    data={messages}
                    renderItem={({ item }) => <Idea idea={item} filter={filter} />}
                    keyExtractor={item => item.id + ''}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={3000}
                    onEndReached={() => {
                        !loading && loadMore();
                    }}
                    ListHeaderComponent={mood ? <MoodState mood={mood} /> : undefined}
                    ListFooterComponent={loading ? LoadingAnimated : <></>}
                    ListFooterComponentStyle={{ marginVertical: 12 }}
                    refreshControl={
                        <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
                    }
                />
            )}

            {networkError && <NetworkErrorFeed callback={() => fetchMessages(true)} />}

            {!loading && messages?.length === 0 && !networkError && (
                <EmptyState message={emptyTitle} />
            )}

            {loading && messages?.length === 0 && (
                <View style={styles.center}>
                    <LoadingAnimated />
                </View>
            )}
        </>
    );
};

interface MoodStateProp {
    mood: string;
}

const MoodState = ({ mood }: MoodStateProp) => (
    <View style={{ width: '100%', alignItems: 'center' }}>
        <View style={stylescom.wrap_mood}>
            <Text style={[styles.h7, { marginBottom: 5 }]}>Estado:</Text>
            <View style={[styles.flex_center, { justifyContent: 'flex-start' }]}>
                <Text style={{ fontSize: 30, marginHorizontal: 8 }}>
                    {mood.substring(0, mood.indexOf('|'))}
                </Text>
                <View style={{ flexShrink: 1, alignSelf: 'center' }}>
                    <Text style={[styles.idea_msg, { marginVertical: 8 }]}>
                        {mood.substring(mood.indexOf('|') + 1)}
                    </Text>
                </View>
            </View>
        </View>
    </View>
);

const stylescom = StyleSheet.create({
    wrap_mood: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '90%',
        marginVertical: 8,
    },
});
