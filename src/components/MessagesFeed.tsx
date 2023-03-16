import { FlatList, View } from 'react-native';
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
    profile?: boolean;
    icon: IconDefinition;
    emptyTitle: string;
}

const MessagesFeed = ({
    params,
    filter,
    title,
    myideas = false,
    profile,
    icon,
    emptyTitle,
}: MessagesFeedProp) => {
    const dispatch = useDispatch();
    const { messages } = useAppSelector((state: RootState) => state.messages);
    const { fetchMessages, moreMsg, loading, networkError } = useMessages(filter, params);
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
                    // ListHeaderComponent={
                    //     <View style={{ width: '100%', alignItems: 'center' }}>
                    //         <View
                    //             style={{
                    //                 alignItems: 'flex-start',
                    //                 justifyContent: 'flex-start',
                    //                 width: '90%',
                    //                 marginVertical: 8,
                    //             }}
                    //         >
                    //             <Text style={{ ...styles.textbold, fontSize: 14, marginBottom: 5 }}>Estado:</Text>
                    //             <View
                    //                 style={{
                    //                     flexDirection: 'row',
                    //                     alignItems: 'center',
                    //                     justifyContent: 'flex-start',
                    //                     // borderColor: '#01192E',
                    //                     // borderWidth: 1,
                    //                     // borderRadius: 10,
                    //                     // paddingVertical: 6,
                    //                 }}
                    //             >
                    //                 <Text style={{ fontSize: 26, marginHorizontal: 8 }}>🤩</Text>
                    //                 <View style={{ flexShrink: 1, alignSelf: 'flex-start'  }}>
                    //                     <Text style={{ ...styles.text, textAlign: 'left', flexShrink: 1 }}>
                    //                         Hola como estas todos me cago en todo jajajaj ajajs. fffffHola como
                    //                         estas todos me cago en todo jajajaj ajajs. fffff
                    //                 </Text>
                    //                 </View>
                    //             </View>
                    //         </View>
                    //     </View>
                    // }
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

export default MessagesFeed;
