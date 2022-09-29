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
    openNewMsgConversation,
    setConversations,
    setUserStateConversation,
    updateConversations,
} from '../store/feature/chats/chatsSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { styles } from '../themes/appTheme';
import { Conversation, User } from '../types/store';
import { faCircleNodes } from '../constants/icons/FontAwesome';

export const ConnectionsScreen = () => {
    const [loading, setLoading] = useState(true);
    const { conversations } = useAppSelector((state: RootState) => state.chats);
    const navigation = useNavigation<any>();
    const uid = useAppSelector((state: RootState) => state.user.id);
    const { getConversations } = useSpikyService();
    const dispatch = useAppDispatch();
    const { SocketState } = useContext(SocketContext);

    async function loadConversations() {
        setLoading(true);
        const newConversations = await getConversations();
        dispatch(setConversations(newConversations));
        setLoading(false);
    }

    function onOpenConversation(id: number, newMsg: boolean, toUser: User) {
        if (newMsg) {
            dispatch(openNewMsgConversation(id));
        }
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
            dispatch(updateConversations(converToUpdate));
        } else {
            dispatch(addConversation(converToUpdate));
        }
    }

    useEffect(() => {
        SocketState.socket?.on('userOnline', resp => {
            const { converId } = resp;
            updateUserOnline(true, converId);
        });
        SocketState.socket?.on('userOffline', resp => {
            const { converId } = resp;
            updateUserOnline(false, converId);
        });
        SocketState.socket?.on('newChatMsgWithReply', resp => {
            const { conver, newConver } = resp;
            loadNewConversations(newConver, {
                ...conver,
                chatmessage: { ...conver.chatmessage, newMsg: true },
            });
        });
        SocketState.socket?.on('newChatMsg', resp => {
            const { chatmsg, converId } = resp;
            const converToUpdate = conversations.find(conver => conver.id === converId);
            if (converToUpdate)
                loadNewConversations(false, {
                    ...converToUpdate,
                    chatmessage: { ...chatmsg, newMsg: true },
                });
        });
    }, [SocketState.socket]);

    useEffect(() => {
        loadConversations();
    }, []);

    return (
        <BackgroundPaper style={{ justifyContent: 'flex-start' }}>
            <IdeasHeader title={'Conexiones'} connections={true} icon={faCircleNodes} />
            {conversations?.length !== 0 ? (
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
    onOpenConversation: (id: number, newMsg: boolean, toUser: User) => void;
}

const ConversationItem = ({ conver, uid, onOpenConversation }: ConversationItemProp) => {
    const toUser: User = conver.user_1.id !== uid ? conver.user_1 : conver.user_2;
    const time = getTime(conver.chatmessage.date.toString());
    const { chatmessage } = conver;
    const { newMsg } = chatmessage;

    return (
        <TouchableOpacity onPress={() => onOpenConversation(conver.id, newMsg, toUser)}>
            <View style={stylescomp.converWrap}>
                {newMsg && <View style={stylescomp.newChatMsg} />}
                <View style={stylescomp.converContainer}>
                    <View style={{ ...styles.flex, alignItems: 'center' }}>
                        <Text style={{ ...styles.textbold, fontSize: 14 }}>@{toUser.nickname}</Text>
                        <UniversityTag id={toUser.universityId} fontSize={14} />
                        <View
                            style={{
                                ...stylescomp.online,
                                backgroundColor: toUser.online ? '#FC702A' : '#bebebe',
                            }}
                        />
                    </View>
                    <View style={{ paddingHorizontal: 10, marginTop: 5 }}>
                        <Text style={{ ...styles.text, fontSize: 13 }}>
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
    },
    converContainer: {
        ...styles.shadow,
        backgroundColor: 'white',
        height: 70,
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
        height: 70,
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
