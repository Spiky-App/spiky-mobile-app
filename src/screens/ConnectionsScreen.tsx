import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useContext } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { BackgroundPaper } from '../components/BackgroundPaper';
import UniversityTag from '../components/common/UniversityTag';
import { EmptyState } from '../components/EmptyState';
import { IdeasHeader } from '../components/IdeasHeader';
import { LoadingAnimated } from '../components/svg/LoadingAnimated';
import SocketContext from '../context/Socket/Context';
import { getTime } from '../helpers/getTime';
import useSpikyService from '../hooks/useSpikyService';
import { RootState } from '../store';
import {
    addConversation,
    setConversations,
    setUserStateConversation,
    updateAuxActiveConversation,
    updateLastChatMsgConversation,
} from '../store/feature/chats/chatsSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { styles } from '../themes/appTheme';
import { ChatMessage, Conversation, User } from '../types/store';
import { faCircleNodes } from '../constants/icons/FontAwesome';
import { generateConversationFromConversacion } from '../helpers/conversations';
import NetworkErrorFeed from '../components/NetworkErrorFeed';

export const ConnectionsScreen = () => {
    const [loading, setLoading] = useState(true);
    const [networkError, setNetworkError] = useState(false);
    const [first, setFirst] = useState(true);
    const { conversations, activeConversationId } = useAppSelector(
        (state: RootState) => state.chats
    );
    const navigation = useNavigation<any>();
    const uid = useAppSelector((state: RootState) => state.user.id);
    const appState = useAppSelector((state: RootState) => state.ui.appState);
    const { getConversations } = useSpikyService();
    const dispatch = useAppDispatch();
    const { socket } = useContext(SocketContext);

    async function loadConversations() {
        if (networkError) setNetworkError(false);
        setLoading(true);
        const { conversations: conversationsList, networkError: networkErrorReturn } =
            await getConversations();
        if (networkErrorReturn) setNetworkError(true);
        const newConversations = conversationsList.map(conver =>
            generateConversationFromConversacion(conver, uid)
        );
        dispatch(setConversations(newConversations));
        setLoading(false);
    }

    function onOpenConversation(id: number, toUser: User) {
        navigation.navigate('ChatScreen', {
            conversationId: id,
            toUser,
        });
    }

    function updateUserOnline(online: boolean, converId: number) {
        dispatch(setUserStateConversation({ online, converId, uid }));
    }

    function loadNewConversations(newConver: boolean, converToUpdate: Conversation) {
        if (!newConver) {
            if (activeConversationId !== converToUpdate.id)
                dispatch(
                    updateLastChatMsgConversation({
                        chatMsg: converToUpdate.chatmessage,
                        newMsg: true,
                    })
                );
        } else {
            dispatch(addConversation(converToUpdate));
        }
    }

    useEffect(() => {
        socket?.on('userOnline', (resp: { converId: number }) => {
            const { converId } = resp;
            updateUserOnline(true, converId);
        });
        socket?.on('userOffline', (resp: { converId: number }) => {
            const { converId } = resp;
            updateUserOnline(false, converId);
        });
        socket?.on('newChatMsgWithReply', (resp: { conver: Conversation; newConver: boolean }) => {
            const { conver, newConver } = resp;
            loadNewConversations(newConver, conver);
        });
    }, [socket]);

    useEffect(() => {
        if (appState === 'active') loadConversations();
    }, [appState]);

    useEffect(() => {
        if (!first) {
            socket?.removeListener('newChatMsg');
            dispatch(updateAuxActiveConversation());
        } else {
            setFirst(false);
        }
        socket?.on('newChatMsg', (resp: { chatmsg: ChatMessage }) => {
            const { chatmsg } = resp;
            if (activeConversationId !== chatmsg.conversationId) {
                dispatch(updateLastChatMsgConversation({ chatMsg: chatmsg, newMsg: true }));
            }
        });
    }, [socket, activeConversationId]);

    const LoadingConversations = () =>
        loading ? (
            <LoadingAnimated />
        ) : (
            <EmptyState message="Una buena conversacion empieza con una gran idea." />
        );

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <IdeasHeader title={'Conexiones'} connections={true} icon={faCircleNodes} />
            {networkError ? (
                <NetworkErrorFeed callback={loadConversations} />
            ) : conversations?.length !== 0 ? (
                <FlatList
                    style={{ width: '90%' }}
                    data={conversations}
                    renderItem={({ item }) => (
                        <ConversationItem
                            conver={item}
                            uid={uid}
                            onOpenConversation={onOpenConversation}
                        />
                    )}
                    keyExtractor={item => item.id + ''}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponentStyle={{ marginVertical: 12 }}
                />
            ) : (
                <LoadingConversations />
            )}
        </BackgroundPaper>
    );
};

interface ConversationItemProp {
    conver: Conversation;
    uid: number;
    onOpenConversation: (id: number, toUser: User) => void;
}

const ConversationItem = ({ conver, uid, onOpenConversation }: ConversationItemProp) => {
    const toUser: User = conver.user_1.id !== uid ? conver.user_1 : conver.user_2;
    const time = getTime(conver.chatmessage.date.toString());
    const { chatmessage } = conver;
    const { newMsg } = chatmessage;

    return (
        <TouchableOpacity onPress={() => onOpenConversation(conver.id, toUser)}>
            <View style={stylescomp.converWrap}>
                {newMsg && <View style={stylescomp.newChatMsg} />}
                <View style={stylescomp.converContainer}>
                    <View style={{ ...styles.flex, alignItems: 'center' }}>
                        <Text style={{ ...styles.user, fontSize: 15 }}>@{toUser.nickname}</Text>
                        <UniversityTag id={toUser.universityId} fontSize={14} />
                        <View
                            style={{
                                ...stylescomp.online,
                                backgroundColor: toUser.online ? '#FC702A' : '#bebebe',
                            }}
                        />
                    </View>
                    <View style={{ paddingHorizontal: 10, marginTop: 5 }}>
                        <Text style={{ ...styles.text, overflow: 'scroll' }}>
                            {conver.chatmessage.message.length > 80
                                ? conver.chatmessage.message.substring(0, 80) + '...'
                                : conver.chatmessage.message}
                        </Text>
                    </View>
                    <Text style={stylescomp.date}>{time}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const stylescomp = StyleSheet.create({
    flex: {
        flexDirection: 'row',
    },
    converWrap: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center',
    },
    converContainer: {
        ...styles.shadow,
        backgroundColor: 'white',
        height: 80,
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 10,
        flex: 1,
    },
    newChatMsg: {
        backgroundColor: '#FC702A',
        marginRight: 8,
        borderRadius: 3,
        width: 12,
        height: 75,
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
        marginLeft: 8,
    },
});
