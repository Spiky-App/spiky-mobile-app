import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    FlatList,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    View,
} from 'react-native';
import { Comment } from '../components/Comment';
import {
    faArrowLeftLong,
    faCheck,
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
import SpikyService from '../services/SpikyService';
import { RootState } from '../store';
import { setMessages } from '../store/feature/messages/messagesSlice';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigator/Navigator';
import { Comment as CommentState, Message, ReactionType } from '../types/store';
import MsgTransform from '../components/MsgTransform';
import { generateMessageFromMensaje } from '../helpers/message';
import { LoadingAnimated } from '../components/svg/LoadingAnimated';
import { useForm } from '../hooks/useForm';

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
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const service = new SpikyService(config);
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const messageId = route.params?.messageId;
    const { top, bottom } = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<Message>(initialMessage);
    const [messageTrackingId, setMessageTrackingId] = useState<number | undefined>();
    const [ideaOptions, setIdeaOptions] = useState(false);
    const { form, onChange } = useForm<FormComment>(DEFAULT_FORM);
    const refInputComment = React.createRef<TextInput>();
    const [position, setPosition] = useState({
        top: 0,
        left: 0,
    });
    const [comments, setComments] = useState<CommentState[]>();
    const date = getTime(message.date.toString());
    const isOwner = message.user.id === uid;

    const handleReaction = (reactionTypeAux: number) => {
        service.createReactionMsg(uid, message.id, reactionTypeAux);

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
        const response = await service.getMessageAndComments(messageId);
        const { data } = response;
        const { mensaje, num_respuestas } = data;
        const messagesRetrived: Message = generateMessageFromMensaje({
            ...mensaje,
            num_respuestas: num_respuestas,
        });
        setMessage(messagesRetrived);
        setComments(messagesRetrived.comments ?? []);
        setMessageTrackingId(messagesRetrived.messageTrackingId);
        setLoading(false);
    };

    const updateComments = (comment: CommentState) => {
        if (comments) {
            setComments([comment, ...comments]);
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
        <KeyboardAvoidingView
            behavior="height"
            style={{
                width: '100%',
                alignItems: 'center',
                marginTop: top + 10,
                marginBottom: bottom,
                flex: 1,
                position: 'relative',
            }}
        >
            <TouchableOpacity
                style={{ position: 'absolute', top: 0, left: 0, marginLeft: 20 }}
                onPress={() => navigation.goBack()}
            >
                <FontAwesomeIcon icon={faArrowLeftLong} color="#bebebe" />
            </TouchableOpacity>

            {!loading ? (
                <>
                    <View style={stylescom.wrap}>
                        {isOwner && (
                            <View style={stylescom.pin}>
                                <View>
                                    <FontAwesomeIcon icon={faLightbulb} color="white" size={13} />
                                </View>
                            </View>
                        )}

                        {messageTrackingId && (
                            <View style={{ ...stylescom.pin, backgroundColor: '#FC702A' }}>
                                <View style={{ transform: [{ rotate: '45deg' }] }}>
                                    <FontAwesomeIcon icon={faThumbtack} color="white" size={13} />
                                </View>
                            </View>
                        )}

                        <View style={stylescom.flex}>
                            <TouchableOpacity onPress={() => {}}>
                                <Text style={{ ...styles.user, ...styles.textbold }}>
                                    @{message.user.nickname}
                                </Text>
                            </TouchableOpacity>
                            <Text style={{ ...styles.text, fontSize: 13 }}> de </Text>
                            <Text style={{ ...styles.text, fontSize: 13 }}>
                                {message.user.university.shortname}
                            </Text>
                        </View>

                        <View style={{ marginVertical: 8 }}>
                            <MsgTransform
                                textStyle={{ ...styles.text, ...stylescom.msg }}
                                text={message.message}
                            />
                        </View>

                        <View
                            style={{
                                ...stylescom.container,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            {!message.reactionType && !isOwner ? (
                                <View
                                    style={{ ...stylescom.container, ...stylescom.containerReact }}
                                >
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
                                    <View style={stylescom.container}>
                                        <View style={stylescom.reaction}>
                                            <FontAwesomeIcon
                                                icon={faXmark}
                                                color={
                                                    message.reactionType === ReactionType.AGAINST
                                                        ? '#6A000E'
                                                        : '#bebebe'
                                                }
                                                size={12}
                                            />
                                            <Text style={{ ...styles.text, ...styles.numberGray }}>
                                                {message.against === 0 ? '' : message.against}
                                            </Text>
                                        </View>

                                        <View style={stylescom.reaction}>
                                            <FontAwesomeIcon
                                                icon={faCheck}
                                                color={
                                                    message.reactionType === ReactionType.FAVOR
                                                        ? '#0B5F00'
                                                        : '#bebebe'
                                                }
                                                size={12}
                                            />
                                            <Text style={{ ...styles.text, ...styles.numberGray }}>
                                                {message.favor === 0 ? '' : message.favor}
                                            </Text>
                                        </View>

                                        <View style={stylescom.reaction}>
                                            <FontAwesomeIcon
                                                icon={faMessage}
                                                color={'#bebebe'}
                                                size={12}
                                            />
                                            <Text style={{ ...styles.text, ...styles.numberGray }}>
                                                {message.answersNumber === 0
                                                    ? ''
                                                    : message.answersNumber}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={{ ...stylescom.container, alignItems: 'center' }}>
                                        <Text style={{ ...styles.text, ...styles.numberGray }}>
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
                                            <Text style={{ ...styles.textbold, ...stylescom.dots }}>
                                                ...
                                            </Text>
                                        </TouchableOpacity>

                                        <ModalIdeaOptions
                                            setIdeaOptions={setIdeaOptions}
                                            ideaOptions={ideaOptions}
                                            position={position}
                                            myIdea={isOwner}
                                            messageId={message.id}
                                            messageTrackingId={messageTrackingId}
                                            setMessageTrackingId={setMessageTrackingId}
                                        />
                                    </View>
                                </>
                            )}
                        </View>
                    </View>

                    {/* Line gray  */}
                    <View
                        style={{ width: '90%', borderBottomWidth: 2, borderBottomColor: '#eeeeee' }}
                    ></View>

                    {message.reactionType !== undefined || isOwner ? (
                        <>
                            {comments && comments.length > 0 ? (
                                <FlatList
                                    style={{
                                        flex: 1,
                                        width: '80%',
                                        marginTop: 20,
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
                            ) : (
                                <View style={stylescom.center}>
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
                        <View style={stylescom.center}>
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
    },
    wrap: {
        width: '75%',
        paddingBottom: 10,
        marginTop: 25,
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
    pin: {
        position: 'absolute',
        top: -4,
        right: 0,
        // transform: [{ rotate: '45deg' }],
        backgroundColor: '#01192E',
        borderRadius: 6,
        width: 35,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
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
