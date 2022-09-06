import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { EmptyState } from '../components/EmptyState';
import { IdeasHeader } from '../components/IdeasHeader';
import { LoadingAnimated } from '../components/svg/LoadingAnimated';
import { getTime } from '../helpers/getTime';
import useSpikyService from '../hooks/useSpikyService';
import { RootState } from '../store';
import { useAppSelector } from '../store/hooks';
import { styles } from '../themes/appTheme';
import { Conversation, User } from '../types/store';

export const ConnectionsScreen = () => {
    const [loading, setLoading] = useState(true);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const uid = useAppSelector((state: RootState) => state.user.id);
    const { getConversations } = useSpikyService();

    async function loadConversations() {
        setLoading(true);
        const newConversations = await getConversations();
        setConversations(newConversations);
        setLoading(false);
    }

    useEffect(() => {
        loadConversations();
    }, []);

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <IdeasHeader title={'Conexiones'} connections={true} />
            {conversations?.length !== 0 ? (
                <FlatList
                    style={{ width: '90%' }}
                    data={conversations}
                    renderItem={({ item }) => <ConversationItem conver={item} uid={uid} />}
                    keyExtractor={item => item.id + ''}
                    showsVerticalScrollIndicator={false}
                    // onEndReached={loadMore}
                    ListFooterComponent={loading ? LoadingAnimated : <></>}
                    ListFooterComponentStyle={{ marginVertical: 12 }}
                />
            ) : loading ? (
                <LoadingAnimated />
            ) : (
                <EmptyState message="Una buena conversacion empieza con una gran idea." />
            )}
        </BackgroundPaper>
    );
};

interface ConversationItemProp {
    conver: Conversation;
    uid: number;
}

const ConversationItem = ({ conver, uid }: ConversationItemProp) => {
    const navigation = useNavigation<any>();
    const toUser: User = conver.user_1.id !== uid ? conver.user_1 : conver.user_2;
    const time = getTime(conver.chatmessages[0].date.toString());

    const handleOpenChat = () => {
        navigation.navigate('ChatScreen', {
            conversationId: conver.id,
        });
    };

    return (
        <TouchableOpacity style={{}} onPress={handleOpenChat}>
            <View style={stylescomp.converWrap}>
                <View
                    style={{
                        ...stylescomp.newChatMsg,
                        backgroundColor: true ? '#FC702A' : 'white',
                    }}
                />
                <View style={{ ...styles.flex, alignItems: 'center' }}>
                    <Text style={{ ...styles.textbold, fontSize: 14 }}>@{toUser.nickname}</Text>
                    <Text style={{ ...styles.text, fontSize: 14 }}> de </Text>
                    <Text style={{ ...styles.text, fontSize: 14 }}>
                        {toUser.university.shortname}
                    </Text>
                    <View style={stylescomp.online} />
                </View>
                <View style={{ paddingHorizontal: 10, marginTop: 5 }}>
                    <Text style={{ ...styles.text, fontSize: 13 }}>
                        {conver.chatmessages[0].message.length > 80
                            ? conver.chatmessages[0].message.substring(0, 80) + '...'
                            : conver.chatmessages[0].message}
                    </Text>
                </View>
                <Text style={stylescomp.date}>{time}</Text>
            </View>
        </TouchableOpacity>
    );
};

const stylescomp = StyleSheet.create({
    flex: {
        flexDirection: 'row',
    },
    converWrap: {
        ...styles.shadow,
        backgroundColor: 'white',
        borderRadius: 6,
        height: 75,
        paddingHorizontal: 18,
        paddingVertical: 10,
    },
    newChatMsg: {
        position: 'absolute',
        top: 8,
        bottom: 8,
        left: 6,
        borderRadius: 3,
        width: 8,
    },
    date: {
        ...styles.textGray,
        position: 'absolute',
        top: 8,
        right: 8,
    },
    online: {
        height: 8,
        width: 8,
        borderRadius: 5,
        backgroundColor: '#FC702A',
        marginLeft: 8,
    },
});
