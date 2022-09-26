import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    Animated,
    Pressable,
    StyleSheet,
    Text,
    TouchableHighlight,
    // TouchableOpacity,
    View,
} from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import {
    faCheck,
    faLightbulb,
    faMessage,
    faMinus,
    faXmark,
    faPen,
} from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import { getTime } from '../helpers/getTime';
import { ModalIdeaOptions } from './ModalIdeaOptions';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons/faThumbtack';
import { Message, ReactionType } from '../types/store';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import MsgTransform from './MsgTransform';
import { useAnimation } from '../hooks/useAnimation';
import { setMessages } from '../store/feature/messages/messagesSlice';
import { MessageRequestData } from '../services/models/spikyService';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { setModalAlert } from '../store/feature/ui/uiSlice';
import SocketContext from '../context/Socket/Context';
import useSpikyService from '../hooks/useSpikyService';

interface Props {
    idea: Message;
    filter: string;
}

const reactionTypes: ['neutral', 'favor', 'against'] = ['neutral', 'favor', 'against'];

export const Idea = ({ idea, filter }: Props) => {
    const { id: uid, nickname } = useAppSelector((state: RootState) => state.user);
    const messages = useAppSelector((state: RootState) => state.messages.messages);
    const { createReactionMsg, deleteIdea } = useSpikyService();
    const dispatch = useAppDispatch();
    const navigation = useNavigation<any>();
    const [ideaOptions, setIdeaOptions] = useState(false);
    const { opacity, fadeIn } = useAnimation();
    const { SocketState } = useContext(SocketContext);
    const socket = SocketState.socket;
    const [position, setPosition] = useState({
        top: 0,
        left: 0,
    });
    const {
        id,
        message,
        date,
        user,
        against,
        answersNumber,
        messageTrackingId,
        reactionType,
        sequence,
        favor,
        draft,
    } = idea;
    const isOwner = user.id === uid;
    const isDraft = draft === 1;
    const fecha = getTime(date.toString());

    const handleReaction = (reactionTypeAux: number) => {
        createReactionMsg(uid, id, reactionTypeAux);

        const messagesUpdated = messages.map(msg => {
            if (msg.id === id) {
                socket?.emit('notify', {
                    id_usuario1: msg.user.id,
                    id_usuario2: uid,
                    id_mensaje: msg.id,
                    tipo: 1,
                });
                return {
                    ...msg,
                    [reactionTypes[reactionTypeAux]]: msg[reactionTypes[reactionTypeAux]] + 1,
                    reactionType: reactionTypeAux,
                };
            } else {
                return msg;
            }
        });
        dispatch(setMessages(messagesUpdated));
    };
    const handleDelete = () => {
        deleteIdea(id);

        const messagesUpdated = messages.filter(msg => msg.id !== id);
        dispatch(setMessages(messagesUpdated));
        dispatch(setModalAlert({ isOpen: true, text: 'Idea eliminada', icon: faTrash }));
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

    const handleClickUser = useCallback(() => {
        if (user.nickname === nickname) {
            changeScreen('MyIdeasScreen');
        } else {
            changeScreen('ProfileScreen', {
                alias: user.nickname,
            });
        }
    }, [user]);

    useEffect(() => {
        if (position.top !== 0) {
            setIdeaOptions(value => !value);
        }
    }, [position]);

    useEffect(() => {
        fadeIn(150, () => {}, sequence * 150);
    }, []);

    return (
        <Animated.View style={{ ...stylescom.wrap, opacity }}>
            <View style={stylescom.subwrap}>
                {isOwner && (
                    <View style={stylescom.corner}>
                        <View style={{ transform: [{ rotate: '-45deg' }] }}>
                            <FontAwesomeIcon
                                icon={isDraft ? faPen : faLightbulb}
                                color="white"
                                size={13}
                            />
                        </View>
                    </View>
                )}

                {messageTrackingId && (
                    <View style={{ ...stylescom.corner, backgroundColor: '#FC702A' }}>
                        <View>
                            <FontAwesomeIcon icon={faThumbtack} color="white" size={13} />
                        </View>
                    </View>
                )}

                <View style={styles.flex}>
                    <Pressable onPress={handleClickUser}>
                        <Text style={{ ...stylescom.user, ...styles.textbold }}>
                            @{user.nickname}
                        </Text>
                    </Pressable>
                    <Text style={{ ...styles.text, fontSize: 13 }}> de </Text>
                    <Text style={{ ...styles.text, fontSize: 13 }}>
                        {user.university.shortname}
                    </Text>
                </View>

                <View style={{ marginTop: 6 }}>
                    <MsgTransform textStyle={{ ...styles.text, ...stylescom.msg }} text={message} />
                </View>

                <View
                    style={{
                        ...stylescom.container,
                        marginTop: 2,
                        justifyContent: 'space-between',
                    }}
                >
                    {reactionType === undefined && !isOwner ? (
                        <View style={{ ...stylescom.container, ...stylescom.containerReact }}>
                            <TouchableHighlight
                                style={stylescom.reactButton}
                                underlayColor="#01192E"
                                onPress={() => handleReaction(2)}
                            >
                                <FontAwesomeIcon icon={faXmark} color="white" size={18} />
                            </TouchableHighlight>

                            <TouchableHighlight
                                style={stylescom.reactButton}
                                underlayColor="#01192E"
                                onPress={() => handleReaction(1)}
                            >
                                <FontAwesomeIcon icon={faCheck} color="white" size={18} />
                            </TouchableHighlight>

                            <TouchableHighlight
                                style={stylescom.reactButton}
                                underlayColor="#01192E"
                                onPress={() => handleReaction(0)}
                            >
                                <FontAwesomeIcon icon={faMinus} color="white" size={18} />
                            </TouchableHighlight>
                        </View>
                    ) : (
                        <>
                            {isDraft ? (
                                <Pressable style={stylescom.eraseDraft} onPress={handleDelete}>
                                    <FontAwesomeIcon icon={faTrash} color="#bebebe" size={16} />
                                </Pressable>
                            ) : (
                                <View style={stylescom.container}>
                                    <View style={stylescom.reaction}>
                                        <FontAwesomeIcon
                                            icon={faXmark}
                                            color={
                                                reactionType === ReactionType.AGAINST
                                                    ? '#6A000E'
                                                    : '#bebebe'
                                            }
                                            size={12}
                                        />
                                        <Text style={{ ...styles.text, ...stylescom.number }}>
                                            {against === 0 ? '' : against}
                                        </Text>
                                    </View>

                                    <View style={stylescom.reaction}>
                                        <FontAwesomeIcon
                                            icon={faCheck}
                                            color={
                                                reactionType === ReactionType.FAVOR
                                                    ? '#0B5F00'
                                                    : '#bebebe'
                                            }
                                            size={12}
                                        />
                                        <Text style={{ ...styles.text, ...stylescom.number }}>
                                            {favor === 0 ? '' : favor}
                                        </Text>
                                    </View>

                                    <Pressable style={stylescom.reaction} onPress={handleOpenIdea}>
                                        <FontAwesomeIcon
                                            icon={faMessage}
                                            color={'#bebebe'}
                                            size={12}
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
                                        <Pressable
                                            onPress={event => {
                                                setPosition({
                                                    top: event.nativeEvent.pageY,
                                                    left: event.nativeEvent.pageX,
                                                });
                                            }}
                                        >
                                            <Text style={{ ...styles.textbold, ...stylescom.dots }}>
                                                ...
                                            </Text>
                                        </Pressable>
                                    </>
                                )}

                                <ModalIdeaOptions
                                    setIdeaOptions={setIdeaOptions}
                                    ideaOptions={ideaOptions}
                                    position={position}
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
                            </View>
                        </>
                    )}
                </View>
            </View>
        </Animated.View>
    );
};

const stylescom = StyleSheet.create({
    wrap: {
        width: '100%',
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
        overflow: 'hidden',
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
    },
    user: {
        fontWeight: '600',
        fontSize: 13,
    },
    msg: {
        fontSize: 13,
        textAlign: 'left',
        flexShrink: 1,
    },
    reaction: {
        flexDirection: 'row',
        marginRight: 25,
        alignItems: 'center',
        justifyContent: 'center',
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
        marginLeft: 3,
    },
    publishContainer: {
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
    dots: {
        fontWeight: '600',
        color: '#bebebe',
        fontSize: 22,
        marginLeft: 20,
    },
    reactButton: {
        backgroundColor: '#D4D4D4',
        borderRadius: 2,
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 3,
    },
    containerReact: {
        justifyContent: 'space-around',
        flex: 1,
        flexDirection: 'row',
        marginTop: 8,
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
});
