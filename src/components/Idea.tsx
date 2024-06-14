import React, { useContext, useEffect, useState } from 'react';
import { Animated, View, Linking, Alert } from 'react-native';
import { CommonActions, NavigationProp, useNavigation } from '@react-navigation/native';
import { styles } from '../themes/appTheme';
import { IdeaType, Message, TopicQuestion, User } from '../types/store';
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
        const ideaSelected =
            idea.type === IdeaType.X2 && idea.childMessage ? idea.childMessage : idea;
        const wasCreated = await createIdeaReaction(ideaSelected.id, reaction, user.id);
        if (wasCreated) {
            socket?.emit('notify', {
                id_usuario1: ideaSelected.user.id,
                id_usuario2: user.id,
                id_mensaje: ideaSelected.id,
                tipo: 1,
            });
            const messagesUpdated = messages.map((msg: Message) => {
                if (msg.id === idea.id) {
                    if (msg.type === IdeaType.X2 && msg.childMessage) {
                        let isNew = true;
                        let reactions = msg.childMessage.reactions.map(r => {
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
                            childMessage: {
                                ...msg.childMessage,
                                reactions,
                                myReaction: reaction,
                            },
                        };
                    } else {
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
                    }
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
        const ideaSelected =
            idea.type === IdeaType.X2 && idea.childMessage ? idea.childMessage : idea;
        const wasCreated = await createIdea('', IdeaType.X2, ideaSelected.id);
        if (wasCreated) {
            socket?.emit('notify', {
                id_usuario1: ideaSelected.user.id,
                id_usuario2: user.id,
                id_mensaje: ideaSelected.id,
                tipo: 9,
            });
            const messagesUpdated = messages.map((msg: Message) => {
                if (msg.id === idea.id) {
                    if (msg.type === IdeaType.X2 && msg.childMessage) {
                        return {
                            ...msg,
                            childMessage: {
                                ...msg.childMessage,
                                totalX2: msg.totalX2 + 1,
                                myX2: true,
                            },
                        };
                    } else {
                        return {
                            ...msg,
                            totalX2: msg.totalX2 + 1,
                            myX2: true,
                        };
                    }
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

    function OpenCreateQuoteScreen() {
        setIsLoading(true);
        const ideaSelected =
            idea.type === IdeaType.X2 && idea.childMessage ? idea.childMessage : idea;
        navigation.navigate('CreateQuoteScreen', { idea: ideaSelected });
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

    function handleClicTopicQuestion(topicQuestion: TopicQuestion | undefined) {
        if (topicQuestion) {
            changeScreen('TopicQuestionsScreen', {
                topicQuestion,
            });
        }
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
            <Animated.View style={[styles.flex_center, { opacity }]}>
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
                    handleCreateEmojiReaction={!isLoading ? handleCreateEmojiReaction : () => {}}
                    handleCreateX2Reaction={!isLoading ? handleCreateX2Reaction : () => {}}
                    OpenCreateQuoteScreen={OpenCreateQuoteScreen}
                    handleClicTopicQuestion={handleClicTopicQuestion}
                />
            </Animated.View>
        </View>
    );
};
