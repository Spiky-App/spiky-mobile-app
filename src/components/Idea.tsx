import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { faLightbulb, faMessage, faPen } from '../constants/icons/FontAwesome';
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
import ReactionsContainer from './common/ReactionsContainer';
import { PreReactionButton } from './PreReactionButton';
import { PreModalIdeaOptions } from './PreModalIdeaOptions';

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
        answersNumber,
        messageTrackingId,
        myReaction,
        reactions,
        sequence,
        draft,
    } = idea;
    const isOwner = user.id === uid;
    const isDraft = draft === 1;
    const fecha = getTime(date.toString());

    const handleDelete = async () => {
        const wasDeleted = await deleteIdea(id);
        if (wasDeleted) {
            const messagesUpdated = messages.filter((msg: Message) => msg.id !== id);
            dispatch(setMessages(messagesUpdated));
            dispatch(setModalAlert({ isOpen: true, text: 'Idea eliminada', icon: faTrash }));
        }
    };

    const handleOpenIdea = () => {
        navigation.navigate('OpenedIdeaScreen', {
            messageId: id,
            filter: filter,
        });
    };

    const changeScreen = (screen: string, params?: MessageRequestData) => {
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
    };

    const handleClickUser = (goToUser: User) => {
        if (goToUser.nickname === nickname) {
            changeScreen('MyIdeasScreen');
        } else {
            changeScreen('ProfileScreen', {
                alias: goToUser.nickname,
            });
        }
    };

    const handleClickHashtag = (hashtag_text: string) => {
        changeScreen('HashTagScreen', {
            hashtag: hashtag_text,
        });
    };

    useEffect(() => {
        fadeIn(150, () => {}, sequence * 150);
    }, []);

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
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

                    <Pressable onPress={() => handleClickUser(user)}>
                        <View style={styles.button_user}>
                            <Text style={styles.user}>@{user.nickname}</Text>
                            <UniversityTag id={user.universityId} fontSize={13} />
                        </View>
                    </Pressable>

                    <View style={{ marginTop: 6 }}>
                        <MsgTransform
                            textStyle={{ ...styles.text, ...stylescom.msg }}
                            text={message}
                            handleClickUser={handleClickUser}
                            handleClickHashtag={handleClickHashtag}
                        />
                    </View>

                    <View
                        style={{
                            ...stylescom.container,
                            marginTop: 2,
                            justifyContent: 'space-between',
                            position: 'relative',
                        }}
                    >
                        {!myReaction && !isOwner ? (
                            <>
                                <View style={{ flex: 1, height: 15 }} />
                                <PreReactionButton messageId={id} bottom={-15} right={-24} />
                            </>
                        ) : (
                            <>
                                {isDraft ? (
                                    <Pressable style={stylescom.eraseDraft} onPress={handleDelete}>
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            color="#bebebe"
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
                                ) : (
                                    <View style={stylescom.container}>
                                        {reactions.length > 0 && (
                                            <ReactionsContainer
                                                reactionCount={reactions}
                                                myReaction={myReaction}
                                                messageId={id}
                                                handleClickUser={handleClickUser}
                                            />
                                        )}

                                        <Pressable
                                            style={stylescom.reaction}
                                            onPress={handleOpenIdea}
                                        >
                                            <FontAwesomeIcon
                                                icon={faMessage}
                                                color={'#D4D4D4'}
                                                size={16}
                                                style={{
                                                    ...styles.shadow_button,
                                                    shadowOffset: {
                                                        width: 1.5,
                                                        height: 2,
                                                    },
                                                }}
                                            />
                                            <Text style={{ ...styles.text, ...stylescom.number }}>
                                                {answersNumber === 0 ? '' : answersNumber}
                                            </Text>
                                        </Pressable>
                                    </View>
                                )}

                                <View style={stylescom.container}>
                                    {isDraft ? (
                                        <>
                                            <Pressable
                                                style={stylescom.publishDraft}
                                                onPress={() =>
                                                    navigation.navigate('CreateIdeaScreen', {
                                                        draftedIdea: message,
                                                        draftID: id,
                                                    })
                                                }
                                            >
                                                <View style={stylescom.publishContainer}>
                                                    <Text style={stylescom.publish}>
                                                        {'editar / publicar'}
                                                    </Text>
                                                </View>
                                            </Pressable>
                                            <Text style={{ ...styles.text, ...stylescom.number }}>
                                                {fecha}
                                            </Text>
                                        </>
                                    ) : (
                                        <>
                                            <Text style={{ ...styles.text, ...stylescom.number }}>
                                                {fecha}
                                            </Text>
                                            <PreModalIdeaOptions
                                                myIdea={isOwner}
                                                message={{
                                                    messageId: id,
                                                    message,
                                                    user,
                                                    messageTrackingId,
                                                    date,
                                                }}
                                                filter={filter}
                                            />
                                        </>
                                    )}
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Animated.View>
        </View>
    );
};

const stylescom = StyleSheet.create({
    wrap: {
        width: '90%',
        // paddingHorizontal: 10,
        backgroundColor: 'white',
        borderRadius: 8,
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
        paddingBottom: 8,
        paddingHorizontal: 25,
        borderRadius: 8,
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
    reaction: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
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
        fontWeight: '300',
        fontSize: 12,
        color: '#bebebe',
        marginLeft: 5,
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
        fontSize: 13,
        color: 'white',
    },
    erase: {
        fontWeight: '300',
        fontSize: 12,
        color: '#01192E',
        marginLeft: 1,
    },
    corner: {
        position: 'absolute',
        top: -4,
        right: -28,
        transform: [{ rotate: '45deg' }],
        backgroundColor: '#01192E',
        paddingTop: 8,
        paddingBottom: 4,
        paddingHorizontal: 30,
    },
    corner_container: {
        borderRadius: 8,
        position: 'absolute',
        height: 40,
        left: 0,
        right: 0,
        overflow: 'hidden',
    },
});
