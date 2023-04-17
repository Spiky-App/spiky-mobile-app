import React, { useContext, useEffect, useState } from 'react';
import { Animated, StyleSheet, View, Linking, Alert } from 'react-native';
import { CommonActions, NavigationProp, useNavigation } from '@react-navigation/native';
import { styles } from '../themes/appTheme';
import { IdeaType, Message, User } from '../types/store';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import { useAnimation } from '../hooks/useAnimation';
import { setMessages } from '../store/feature/messages/messagesSlice';
import { MessageRequestData } from '../services/models/spikyService';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { setModalAlert } from '../store/feature/ui/uiSlice';
import useSpikyService from '../hooks/useSpikyService';
import { RootStackParamList } from '../navigator/Navigator';
import { IdeaTypes } from './ideas/IdeaTypes';
import SocketContext from '../context/Socket/Context';

interface Props {
    idea: Message;
    filter: string;
}

export const Idea = ({ idea, filter }: Props) => {
    const { id: uid, nickname } = useAppSelector((state: RootState) => state.user);
    const messages = useAppSelector((state: RootState) => state.messages.messages);
    const user = useAppSelector((state: RootState) => state.user);
    const spectatorMode = useAppSelector((state: RootState) => state.ui.spectatorMode);
    const { deleteIdea } = useSpikyService();
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { opacity, fadeIn } = useAnimation({});
    const [isLoading, setIsLoading] = useState(false);
    const { socket } = useContext(SocketContext);
    const { createIdeaReaction, createIdea } = useSpikyService();

    async function handleCreateEmojiReaction(reaction: string[0]) {
        setIsLoading(true);
        const wasCreated = await createIdeaReaction(idea.id, reaction, user.id);
        if (wasCreated) {
            const messagesUpdated = messages.map((msg: Message) => {
                if (msg.id === idea.id) {
                    socket?.emit('notify', {
                        id_usuario1: msg.user.id,
                        id_usuario2: user.id,
                        id_mensaje: msg.id,
                        tipo: 1,
                    });
                    let isNew = true;
                    let reactions = msg.reactions.map(r => {
                        if (r.reaction === reaction) {
                            isNew = false;
                            return {
                                reaction: r.reaction,
                                count: r.count + 1,
                            };
                        } else {
                            return r;
                        }
                    });
                    if (isNew) {
                        reactions = [...reactions, { reaction, count: 1 }];
                    }
                    return {
                        ...msg,
                        reactions,
                        myReaction: reaction,
                    };
                } else {
                    return msg;
                }
            });
            dispatch(setMessages(messagesUpdated));
        }
        setIsLoading(false);
    }

    async function handleCreateX2Reaction() {
        setIsLoading(true);
        const wasCreated = await createIdea('', IdeaType.X2, idea.id);
        if (wasCreated) {
            const messagesUpdated = messages.map((msg: Message) => {
                if (msg.id === idea.id) {
                    socket?.emit('notify', {
                        id_usuario1: msg.user.id,
                        id_usuario2: user.id,
                        id_mensaje: msg.id,
                        tipo: 9,
                    });
                    return {
                        ...msg,
                        totalX2: msg.totalX2 + 1,
                        myX2: true,
                    };
                } else {
                    return msg;
                }
            });
            dispatch(setMessages(messagesUpdated));
        }
        setIsLoading(false);
    }

    async function handleDelete(id: number) {
        const wasDeleted = await deleteIdea(id);
        if (wasDeleted) {
            const messagesUpdated = messages.filter((msg: Message) => msg.id !== id);
            dispatch(setMessages(messagesUpdated));
            dispatch(setModalAlert({ isOpen: true, text: 'Idea eliminada', icon: faTrash }));
        }
    }

    function handleOpenIdea(id: number) {
        navigation.navigate('OpenedIdeaScreen', {
            ideaId: id,
            filter: filter,
        });
    }

    function changeScreen(screen: string, params?: MessageRequestData) {
        const targetRoute = navigation
            .getState()
            .routes.find((route: { name: string }) => route.name === screen);
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: screen,
                        params: {
                            ...targetRoute?.params,
                            ...params,
                        },
                    },
                ],
            })
        );
    }

    function handleClickUser(goToUser: User) {
        if (goToUser.nickname === nickname) {
            changeScreen('MyIdeasScreen');
        } else {
            changeScreen('ProfileScreen', {
                alias: goToUser.nickname,
            });
        }
    }

    function handleClickHashtag(hashtag_text: string) {
        changeScreen('HashTagScreen', {
            hashtag: hashtag_text,
        });
    }

    async function handleClickLink(url: string) {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert('URL no soportado.');
        }
    }

    useEffect(() => {
        fadeIn(150, () => {}, idea.sequence * 150);
    }, []);

    return (
        <View style={styles.center}>
            <Animated.View style={{ ...stylescom.white_wrap, opacity }}>
                <View style={stylescom.subwrap}>
                    <IdeaTypes
                        idea={idea}
                        filter={filter}
                        isOwner={uid === idea.user.id}
                        handleClickUser={handleClickUser}
                        handleClickHashtag={handleClickHashtag}
                        handleClickLink={handleClickLink}
                        handleOpenIdea={handleOpenIdea}
                        handleDelete={handleDelete}
                        isOpenedIdeaScreen={false}
                        spectatorMode={spectatorMode}
                        handleCreateEmojiReaction={
                            !isLoading ? handleCreateEmojiReaction : () => {}
                        }
                        handleCreateX2Reaction={!isLoading ? handleCreateX2Reaction : () => {}}
                    />
                </View>
            </Animated.View>
        </View>
    );
};

const stylescom = StyleSheet.create({
    white_wrap: {
        ...styles.white_wrap,
        marginVertical: 8,
        width: '92%',
    },
    subwrap: {
        paddingTop: 15,
        paddingBottom: 6,
        paddingHorizontal: 25,
        borderRadius: 14,
    },
});
