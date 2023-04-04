import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Animated, Pressable, StyleSheet, Text, View, Linking, Alert } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { faLightbulb, faPen } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import { getTime } from '../helpers/getTime';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons/faThumbtack';
import { Message, User } from '../types/store';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import MsgTransform from './MsgTransform';
import { useAnimation } from '../hooks/useAnimation';
import { setMessages } from '../store/feature/messages/messagesSlice';
import { MessageRequestData } from '../services/models/spikyService';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { setModalAlert } from '../store/feature/ui/uiSlice';
import useSpikyService from '../hooks/useSpikyService';
import UniversityTag from './common/UniversityTag';
import ReactionsContainers from './common/ReactionsContainers';
import { IdeaReaction } from './IdeaReaction';
import { PreModalIdeaOptions } from './PreModalIdeaOptions';
import { Poll } from './Poll';
import { CommentsButton } from './common/CommentsButton';

interface Props {
    idea: Message;
    filter: string;
}

export const Idea = ({ idea, filter }: Props) => {
    const { id: uid, nickname } = useAppSelector((state: RootState) => state.user);
    const messages = useAppSelector((state: RootState) => state.messages.messages);
    const { deleteIdea } = useSpikyService();
    const dispatch = useAppDispatch();
    const navigation = useNavigation<any>();
    const { opacity, fadeIn } = useAnimation({});
    const {
        id,
        message,
        date,
        user,
        totalComments,
        messageTrackingId,
        myReaction,
        reactions,
        sequence,
        type,
        answers,
        myAnswers,
        totalAnswers,
        totalX2,
        myX2,
        anonymous,
    } = idea.type === 3 && idea.childMessage ? { ...idea.childMessage, type: 3 } : idea;
    const isOwner = user.id === uid;
    const isNormal = type === 0;
    const isDraft = type === 1;
    const isPoll = type === 2;
    const isX2 = type === 3;
    const fecha = getTime(date.toString());

    async function handleDelete() {
        const wasDeleted = await deleteIdea(id);
        if (wasDeleted) {
            const messagesUpdated = messages.filter((msg: Message) => msg.id !== id);
            dispatch(setMessages(messagesUpdated));
            dispatch(setModalAlert({ isOpen: true, text: 'Idea eliminada', icon: faTrash }));
        }
    }

    function handleOpenIdea() {
        navigation.navigate('OpenedIdeaScreen', {
            messageId: id,
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
        fadeIn(150, () => {}, sequence * 150);
    }, []);

    return (
        <View style={styles.center}>
            <Animated.View style={{ ...stylescom.wrap, opacity }}>
                <View style={stylescom.subwrap}>
                    {isOwner && (
                        <View style={stylescom.corner_container}>
                            <View style={stylescom.corner}>
                                <View style={{ transform: [{ rotate: '-45deg' }] }}>
                                    <FontAwesomeIcon
                                        icon={isDraft ? faPen : faLightbulb}
                                        color="white"
                                        size={13}
                                    />
                                </View>
                            </View>
                        </View>
                    )}

                    {messageTrackingId && (
                        <View style={stylescom.corner_container}>
                            <View style={{ ...stylescom.corner, backgroundColor: '#FC702A' }}>
                                <View>
                                    <FontAwesomeIcon icon={faThumbtack} color="white" size={13} />
                                </View>
                            </View>
                        </View>
                    )}
                    {isX2 && (
                        <View style={{ marginBottom: 10 }}>
                            <View style={styles.button_user}>
                                <Text style={styles.user_reply}>@{idea.user.nickname}</Text>
                                <UniversityTag
                                    id={idea.user.universityId}
                                    fontSize={11.8}
                                    noColor
                                />
                                <Text style={styles.user_reply}>X2</Text>
                            </View>
                        </View>
                    )}

                    {anonymous ? (
                        <View style={styles.button_user}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.user}>@_______</Text>
                            </View>
                        </View>
                    ) : (
                        <Pressable
                            onPress={() => handleClickUser(user)}
                            style={{ alignSelf: 'flex-start' }}
                        >
                            <View style={styles.button_user}>
                                <Text style={styles.user}>@{user.nickname}</Text>
                                <UniversityTag id={user.universityId} fontSize={14} />
                            </View>
                        </Pressable>
                    )}

                    <View style={{ paddingVertical: 14 }}>
                        <MsgTransform
                            textStyle={stylescom.msg}
                            text={message}
                            handleClickUser={handleClickUser}
                            handleClickHashtag={handleClickHashtag}
                            handleClickLink={handleClickLink}
                        />
                    </View>

                    <View
                        style={{
                            ...stylescom.container,
                            justifyContent: 'space-between',
                        }}
                    >
                        {isPoll && (
                            <Poll
                                answers={answers}
                                totalAnswers={totalAnswers}
                                myAnswers={myAnswers}
                                messageId={id}
                                userIdMessageOwner={user.id ? user.id : 0}
                                handleClickUser={handleClickUser}
                                totalComments={totalComments}
                                handleOpenIdea={handleOpenIdea}
                                isAnonymous={anonymous}
                            />
                        )}
                        {isDraft && (
                            <Pressable style={styles.button_container} onPress={handleDelete}>
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    color="#67737D"
                                    size={16}
                                    style={{
                                        ...styles.shadow_button,
                                        shadowOffset: {
                                            width: 1.5,
                                            height: 2,
                                        },
                                    }}
                                />
                            </Pressable>
                        )}
                        {(isNormal || isX2) && (
                            <View style={stylescom.container}>
                                <ReactionsContainers
                                    reactionCount={reactions}
                                    myReaction={myReaction}
                                    id={id}
                                    handleClickUser={handleClickUser}
                                    isIdea
                                    totalX2={totalX2}
                                    myX2={myX2}
                                />
                                <CommentsButton
                                    callback={handleOpenIdea}
                                    totalComments={totalComments}
                                />
                            </View>
                        )}
                        {isDraft && (
                            <View style={stylescom.container}>
                                <Pressable
                                    style={stylescom.publishDraft}
                                    onPress={() =>
                                        navigation.navigate('CreateIdeaScreen', {
                                            draftedIdea: message,
                                            draftID: id,
                                        })
                                    }
                                >
                                    <View style={styles.button_container}>
                                        <Text style={stylescom.publish}>{'editar / publicar'}</Text>
                                    </View>
                                </Pressable>
                                <Text style={{ ...styles.text, ...stylescom.number }}>{fecha}</Text>
                            </View>
                        )}
                        {(isNormal || myAnswers || isX2) && !isDraft && (
                            <View style={[isPoll && stylescom.container_abs, stylescom.container]}>
                                <Text style={{ ...styles.text, ...stylescom.number }}>{fecha}</Text>
                                <PreModalIdeaOptions
                                    myIdea={isOwner}
                                    message={{
                                        messageId: id,
                                        message,
                                        user,
                                        messageTrackingId,
                                        date,
                                        messageType: type,
                                        anonymous,
                                    }}
                                    filter={filter}
                                />
                            </View>
                        )}
                    </View>
                    {!myX2 && !myReaction && (!isOwner || anonymous) && isNormal && (
                        <IdeaReaction messageId={id} isOwnerAndAnonymous={isOwner && anonymous} />
                    )}
                </View>
            </Animated.View>
        </View>
    );
};

const stylescom = StyleSheet.create({
    wrap: {
        width: '92%',
        backgroundColor: 'white',
        borderRadius: 14,
        marginVertical: 8,
        shadowColor: '#4d4d4d',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 6,
    },
    subwrap: {
        paddingTop: 15,
        paddingBottom: 6,
        paddingHorizontal: 25,
        borderRadius: 14,
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
    },
    msg: {
        ...styles.text,
        textAlign: 'left',
        flexShrink: 1,
    },
    publishDraft: {
        flexDirection: 'row',
        marginLeft: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    eraseDraft: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 5,
    },
    number: {
        ...styles.text,
        fontSize: 12,
        color: '#01192e5a',
        marginLeft: 1,
    },
    publishContainer: {
        ...styles.shadow_button,
        backgroundColor: '#D4D4D4',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 3,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginRight: 10,
    },
    publish: {
        ...styles.h5,
        fontSize: 12,
        color: '#01192e5a',
    },
    erase: {
        fontWeight: '300',
        fontSize: 12,
        color: '#01192E',
        marginLeft: 1,
    },
    corner: {
        position: 'absolute',
        top: -2,
        right: -26,
        transform: [{ rotate: '45deg' }],
        backgroundColor: '#01192E',
        paddingTop: 8,
        paddingBottom: 4,
        paddingHorizontal: 30,
    },
    corner_container: {
        borderTopRightRadius: 14,
        position: 'absolute',
        height: 40,
        left: 0,
        right: 0,
        overflow: 'hidden',
    },
    container_abs: {
        position: 'absolute',
        bottom: -2,
        right: 0,
    },
});
