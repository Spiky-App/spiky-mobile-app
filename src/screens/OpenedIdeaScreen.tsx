import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    View,
} from 'react-native';
import { Comment } from '../components/Comment';
import {
    faCheck,
    faChevronLeft,
    faLightbulb,
    faMessage,
    faMinus,
    faThumbtack,
    faXmark,
} from '../constants/icons/FontAwesome';
import { getTime } from '../helpers/getTime';
import { styles } from '../themes/appTheme';

import { FormComment, InputComment } from '../components/InputComment';
import { ModalIdeaOptions } from '../components/ModalIdeaOptions';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import { setMessages } from '../store/feature/messages/messagesSlice';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigator/Navigator';
import { Comment as CommentState, Message, ReactionType } from '../types/store';
import MsgTransform from '../components/MsgTransform';
import { LoadingAnimated } from '../components/svg/LoadingAnimated';
import { useForm } from '../hooks/useForm';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { useNavigation } from '@react-navigation/native';
import useSpikyService from '../hooks/useSpikyService';

const DEFAULT_FORM: FormComment = {
    comment: '',
};

const reactioTypes: ['neutral', 'favor', 'against'] = ['neutral', 'favor', 'against'];
const initialMessage = {
    id: 0,
    message: '',
    date: 0,
    favor: 0,
    neutral: 0,
    against: 0,
    user: {
        id: 0,
        nickname: '',
        university: {
            shortname: '',
        },
    },
    answersNumber: 0,
    draft: 0,
    sequence: 1,
};

type Props = DrawerScreenProps<RootStackParamList, 'OpenedIdeaScreen'>;

export const OpenedIdeaScreen = ({ route }: Props) => {
    const messages = useAppSelector((state: RootState) => state.messages.messages);
    const uid = useAppSelector((state: RootState) => state.user.id);
    const dispatch = useAppDispatch();
    const messageId = route.params?.messageId;
    const filter = route.params?.filter;
    const { top, bottom } = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<Message>(initialMessage);
    const [answersNumber, setAnswersNumber] = useState<number>(message.answersNumber);
    const [messageTrackingId, setMessageTrackingId] = useState<number | undefined>();
    const [ideaOptions, setIdeaOptions] = useState(false);
    const { form, onChange } = useForm<FormComment>(DEFAULT_FORM);
    const refInputComment = React.createRef<TextInput>();
    const navigation = useNavigation<any>();
    const [position, setPosition] = useState({
        top: 0,
        left: 0,
    });
    const [comments, setComments] = useState<CommentState[]>();
    const date = getTime(message.date.toString());
    const isOwner = message.user.id === uid;
    const { createReactionMsg, getIdeaWithComments } = useSpikyService();

    const handleReaction = (reactionTypeAux: number) => {
        createReactionMsg(uid, message.id, reactionTypeAux);

        const messagesUpdated = messages.map(msg => {
            if (msg.id === message?.id) {
                return {
                    ...msg,
                    [reactioTypes[reactionTypeAux]]: msg[reactioTypes[reactionTypeAux]] + 1,
                    reactionType: reactionTypeAux,
                };
            } else {
                return msg;
            }
        });
        dispatch(setMessages(messagesUpdated));
    };

    const handleOpenIdea = async () => {
        const messageRetrived = await getIdeaWithComments(messageId);
        setMessage(messageRetrived);
        setComments(messageRetrived.comments ?? []);
        setMessageTrackingId(messageRetrived.messageTrackingId);
        setAnswersNumber(messageRetrived.comments?.length || 0);
        setLoading(false);
    };

    const updateComments = (comment: CommentState) => {
        if (comments) {
            setComments([comment, ...comments]);
            setAnswersNumber(comments.length + 1);
        }
    };

    useEffect(() => {
        if (position.top !== 0) {
            setIdeaOptions(value => !value);
        }
    }, [position]);

    useEffect(() => {
        if (messageId) {
            handleOpenIdea();
        }
    }, [messageId]);

    return (
        <BackgroundPaper>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{
                    width: '100%',
                    alignItems: 'center',
                    paddingTop: top ? 0 : 15,
                    paddingBottom: bottom ? 0 : 15,
                    flex: 1,
                    position: 'relative',
                }}
            >
                {!loading ? (
                    <>
                        <View style={stylescom.wrap}>
                            <View style={stylescom.subwrap}>
                                {isOwner && (
                                    <View style={stylescom.corner}>
                                        <View style={{ transform: [{ rotate: '-45deg' }] }}>
                                            <FontAwesomeIcon
                                                icon={faLightbulb}
                                                color="white"
                                                size={13}
                                            />
                                        </View>
                                    </View>
                                )}

                                {messageTrackingId && (
                                    <View
                                        style={{ ...stylescom.corner, backgroundColor: '#FC702A' }}
                                    >
                                        <View>
                                            <FontAwesomeIcon
                                                icon={faThumbtack}
                                                color="white"
                                                size={13}
                                            />
                                        </View>
                                    </View>
                                )}

                                <View style={stylescom.flex}>
                                    <TouchableOpacity
                                        style={stylescom.backArrow}
                                        onPress={() => navigation.goBack()}
                                    >
                                        <FontAwesomeIcon
                                            icon={faChevronLeft}
                                            color={'#01192E'}
                                            size={15}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {}}>
                                        <Text style={{ ...styles.user, fontSize: 14 }}>
                                            @{message.user.nickname}
                                        </Text>
                                    </TouchableOpacity>
                                    <Text style={{ ...styles.text, fontSize: 14 }}> de </Text>
                                    <Text style={{ ...styles.text, fontSize: 14 }}>
                                        {message.user.university.shortname}
                                    </Text>
                                </View>

                                <View style={{ marginVertical: 8 }}>
                                    <MsgTransform
                                        textStyle={{
                                            ...styles.text,
                                            ...stylescom.msg,
                                            fontSize: 14,
                                        }}
                                        text={message.message}
                                    />
                                </View>

                                <View
                                    style={{
                                        ...stylescom.container,
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    {!message.reactionType && !isOwner ? (
                                        <View
                                            style={{
                                                ...stylescom.container,
                                                ...stylescom.containerReact,
                                            }}
                                        >
                                            <TouchableHighlight
                                                style={stylescom.reactButton}
                                                underlayColor="#01192E"
                                                onPress={() => handleReaction(2)}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faXmark}
                                                    color="white"
                                                    size={18}
                                                />
                                            </TouchableHighlight>

                                            <TouchableHighlight
                                                style={stylescom.reactButton}
                                                underlayColor="#01192E"
                                                onPress={() => handleReaction(1)}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faCheck}
                                                    color="white"
                                                    size={18}
                                                />
                                            </TouchableHighlight>

                                            <TouchableHighlight
                                                style={stylescom.reactButton}
                                                underlayColor="#01192E"
                                                onPress={() => handleReaction(0)}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faMinus}
                                                    color="white"
                                                    size={18}
                                                />
                                            </TouchableHighlight>
                                        </View>
                                    ) : (
                                        <>
                                            <View style={stylescom.container}>
                                                <View style={stylescom.reaction}>
                                                    <FontAwesomeIcon
                                                        icon={faXmark}
                                                        color={
                                                            message.reactionType ===
                                                            ReactionType.AGAINST
                                                                ? '#6A000E'
                                                                : '#bebebe'
                                                        }
                                                        size={12}
                                                    />
                                                    <Text style={styles.numberGray}>
                                                        {message.against === 0
                                                            ? ' '
                                                            : message.against}
                                                    </Text>
                                                </View>

                                                <View style={stylescom.reaction}>
                                                    <FontAwesomeIcon
                                                        icon={faCheck}
                                                        color={
                                                            message.reactionType ===
                                                            ReactionType.FAVOR
                                                                ? '#0B5F00'
                                                                : '#bebebe'
                                                        }
                                                        size={12}
                                                    />
                                                    <Text style={styles.numberGray}>
                                                        {message.favor === 0 ? ' ' : message.favor}
                                                    </Text>
                                                </View>

                                                <View style={stylescom.reaction}>
                                                    <FontAwesomeIcon
                                                        icon={faMessage}
                                                        color={'#bebebe'}
                                                        size={12}
                                                    />
                                                    <Text style={styles.numberGray}>
                                                        {answersNumber === 0 ? ' ' : answersNumber}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={stylescom.container}>
                                                <Text
                                                    style={{ ...styles.text, ...styles.numberGray }}
                                                >
                                                    {date}
                                                </Text>

                                                <TouchableOpacity
                                                    onPress={event => {
                                                        setPosition({
                                                            top: event.nativeEvent.pageY,
                                                            left: event.nativeEvent.pageX,
                                                        });
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            ...styles.textbold,
                                                            ...stylescom.dots,
                                                        }}
                                                    >
                                                        ...
                                                    </Text>
                                                </TouchableOpacity>

                                                <ModalIdeaOptions
                                                    setIdeaOptions={setIdeaOptions}
                                                    ideaOptions={ideaOptions}
                                                    position={position}
                                                    myIdea={isOwner}
                                                    message={{
                                                        messageId,
                                                        message: message.message,
                                                        user: message.user,
                                                        messageTrackingId,
                                                        date: message.date,
                                                    }}
                                                    setMessageTrackingId={setMessageTrackingId}
                                                    filter={filter}
                                                />
                                            </View>
                                        </>
                                    )}
                                </View>
                            </View>
                        </View>

                        {message.reactionType !== undefined || isOwner ? (
                            <>
                                <View style={{ width: '90%', paddingLeft: 10, marginVertical: 6 }}>
                                    <Text style={{ ...styles.text, ...styles.h5, fontSize: 16 }}>
                                        Comentarios
                                        <Text style={styles.orange}>.</Text>
                                    </Text>
                                </View>
                                {comments && comments.length > 0 ? (
                                    <View style={stylescom.commentWrap}>
                                        <FlatList
                                            style={{
                                                width: '100%',
                                            }}
                                            data={comments}
                                            renderItem={({ item }) => (
                                                <Comment
                                                    comment={item}
                                                    formComment={form}
                                                    onChangeComment={onChange}
                                                    refInputComment={refInputComment}
                                                />
                                            )}
                                            keyExtractor={item => item.id + ''}
                                            showsVerticalScrollIndicator={false}
                                        />
                                    </View>
                                ) : (
                                    <View style={{ ...stylescom.commentWrap, ...styles.center }}>
                                        <Text style={{ ...styles.text, ...stylescom.textGrayPad }}>
                                            Se el primero en contribuir a esta idea.
                                        </Text>
                                    </View>
                                )}
                                <InputComment
                                    messageId={messageId}
                                    updateComments={updateComments}
                                    form={form}
                                    onChange={onChange}
                                    refInputComment={refInputComment}
                                />
                            </>
                        ) : (
                            <View style={{ ...stylescom.commentWrap, ...styles.center }}>
                                <Text style={{ ...styles.text, ...stylescom.textGrayPad }}>
                                    Toma una postura antes de participar
                                </Text>
                            </View>
                        )}
                    </>
                ) : (
                    <View style={{ ...styles.center, flex: 1 }}>
                        <LoadingAnimated />
                    </View>
                )}
            </KeyboardAvoidingView>
        </BackgroundPaper>
    );
};

const stylescom = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flex: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrap: {
        width: '90%',
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
    msg: {
        fontSize: 13,
        textAlign: 'left',
        flexShrink: 1,
        width: '100%',
    },
    reactButton: {
        backgroundColor: '#D4D4D4',
        borderRadius: 2,
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 3,
    },
    reaction: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginRight: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dots: {
        fontWeight: '600',
        color: '#bebebe',
        fontSize: 22,
        marginLeft: 20,
    },
    containerReact: {
        justifyContent: 'space-around',
        flex: 1,
        flexDirection: 'row',
        marginTop: 8,
    },
    textGrayPad: {
        color: '#707070',
        fontSize: 14,
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
    commentWrap: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 15,
        width: '90%',
        borderRadius: 8,
        backgroundColor: 'white',
        shadowColor: '#4d4d4d',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 6,
        paddingHorizontal: 25,
        // paddingVertical: 8,
    },
    backArrow: {
        ...styles.center,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: -16,
    },
});
