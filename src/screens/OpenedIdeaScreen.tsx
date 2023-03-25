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
    TouchableOpacity,
    View,
} from 'react-native';
import { Comment } from '../components/Comment';
import { faChevronLeft, faLightbulb, faThumbtack } from '../constants/icons/FontAwesome';
import { getTime } from '../helpers/getTime';
import { styles } from '../themes/appTheme';

import { FormComment, InputComment } from '../components/InputComment';
import { useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigator/Navigator';
import { Comment as CommentState, Message, User } from '../types/store';
import MsgTransform from '../components/MsgTransform';
import { LoadingAnimated } from '../components/svg/LoadingAnimated';
import { useForm } from '../hooks/useForm';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { CommonActions, useNavigation } from '@react-navigation/native';
import UniversityTag from '../components/common/UniversityTag';
import useSpikyService from '../hooks/useSpikyService';
import { IdeaReaction } from '../components/IdeaReaction';
import ReactionsContainer from '../components/common/ReactionsContainers';
import { PreModalIdeaOptions } from '../components/PreModalIdeaOptions';
import { MessageRequestData } from '../services/models/spikyService';
import { generateMessageFromMensaje } from '../helpers/message';
import { Poll } from '../components/Poll';
import { CommentsButton } from '../components/common/CommentsButton';

const DEFAULT_FORM: FormComment = {
    comment: '',
};

const initialMessage: Message = {
    id: 0,
    message: '',
    date: 0,
    user: {
        id: 0,
        nickname: '',
        universityId: 0,
    },
    totalComments: 0,
    sequence: 1,
    reactions: [],
    answers: [],
    totalAnswers: 0,
    type: 0,
    totalX2: 0,
    myX2: false,
};

type Props = DrawerScreenProps<RootStackParamList, 'OpenedIdeaScreen'>;

export const OpenedIdeaScreen = ({ route: routeSC }: Props) => {
    const { id: uid, nickname } = useAppSelector((state: RootState) => state.user);
    const messageId = routeSC.params?.messageId;
    const filter = routeSC.params?.filter;
    const { top, bottom } = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<Message>(initialMessage);
    const [totalComments, settotalComments] = useState<number>(message.totalComments);
    const [messageTrackingId, setMessageTrackingId] = useState<number | undefined>();
    const { form, onChange } = useForm<FormComment>(DEFAULT_FORM);
    const refInputComment = React.createRef<TextInput>();
    const navigation = useNavigation<any>();
    const [comments, setComments] = useState<CommentState[]>();
    const date = getTime(message.date.toString());
    const isOwner = message.user.id === uid;
    const isPoll = message.answers && message.answers.length > 0;
    const { getIdeaWithComments } = useSpikyService();

    const handleOpenIdea = async () => {
        const mensaje = await getIdeaWithComments(messageId);
        if (mensaje) {
            const messageRetrived = generateMessageFromMensaje(mensaje);
            setMessage(messageRetrived);
            setComments(messageRetrived.comments ?? []);
            setMessageTrackingId(messageRetrived.messageTrackingId);
            settotalComments(messageRetrived.comments?.length || 0);
        } else {
            navigation.goBack();
        }
        setLoading(false);
    };

    const updateComments = (comment: CommentState) => {
        if (comments) {
            setComments([comment, ...comments]);
            settotalComments(comments.length + 1);
        }
    };

    const changeScreen = (screen: string, params?: MessageRequestData) => {
        navigation.pop();
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
        if (messageId) {
            handleOpenIdea();
        }
    }, [messageId]);

    useEffect(() => {
        console.log(message.totalX2);
    }, [message]);

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
                                <TouchableOpacity
                                    style={styles.arrow_back}
                                    onPress={() => navigation.goBack()}
                                >
                                    <FontAwesomeIcon
                                        icon={faChevronLeft}
                                        color={'#D4D4D4'}
                                        size={25}
                                    />
                                </TouchableOpacity>

                                {isOwner && (
                                    <View style={stylescom.corner_container}>
                                        <View style={stylescom.corner}>
                                            <View style={{ transform: [{ rotate: '-45deg' }] }}>
                                                <FontAwesomeIcon
                                                    icon={faLightbulb}
                                                    color="white"
                                                    size={13}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                )}

                                {messageTrackingId && (
                                    <View style={stylescom.corner_container}>
                                        <View
                                            style={{
                                                ...stylescom.corner,
                                                backgroundColor: '#FC702A',
                                            }}
                                        >
                                            <View>
                                                <FontAwesomeIcon
                                                    icon={faThumbtack}
                                                    color="white"
                                                    size={13}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                )}

                                <View style={stylescom.flex}>
                                    <TouchableOpacity onPress={() => handleClickUser(message.user)}>
                                        <View style={styles.button_user}>
                                            <Text style={{ ...styles.user, fontSize: 15 }}>
                                                @{message.user.nickname}
                                            </Text>
                                            <UniversityTag
                                                id={message.user.universityId}
                                                fontSize={14}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ marginVertical: 14 }}>
                                    <MsgTransform
                                        textStyle={{
                                            ...styles.text,
                                            ...stylescom.msg,
                                        }}
                                        text={message.message}
                                        handleClickUser={handleClickUser}
                                        handleClickHashtag={handleClickHashtag}
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
                                            answers={message?.answers || []}
                                            totalAnswers={message.totalAnswers}
                                            myAnswers={message.myAnswers}
                                            messageId={message.id}
                                            userIdMessageOwner={
                                                message.user.id ? message.user.id : 0
                                            }
                                            handleClickUser={handleClickUser}
                                        />
                                    )}
                                    {(message.myX2 || message.myReaction || isOwner) && !isPoll && (
                                        <>
                                            <View style={stylescom.container}>
                                                <ReactionsContainer
                                                    reactionCount={message.reactions}
                                                    myReaction={message.myReaction}
                                                    id={message.id}
                                                    handleClickUser={handleClickUser}
                                                    isIdea
                                                    totalX2={message.totalX2}
                                                    myX2={message.myX2}
                                                />
                                                <CommentsButton totalComments={totalComments} />
                                            </View>
                                        </>
                                    )}
                                    {(message.myX2 ||
                                        message.myReaction ||
                                        isOwner ||
                                        message.myAnswers) && (
                                        <View
                                            style={[
                                                isPoll && stylescom.container_abs,
                                                stylescom.container,
                                            ]}
                                        >
                                            <Text style={{ ...styles.text, ...styles.numberGray }}>
                                                {date}
                                            </Text>

                                            <PreModalIdeaOptions
                                                myIdea={isOwner}
                                                message={{
                                                    messageId: message.id,
                                                    message: message.message,
                                                    user: message.user,
                                                    messageTrackingId,
                                                    date: message.date,
                                                    messageType: message.type,
                                                }}
                                                filter={filter}
                                                setMessageTrackingId={setMessageTrackingId}
                                                isOpenedIdeaScreen
                                            />
                                        </View>
                                    )}
                                </View>
                                {!message.myX2 && !message.myReaction && !isOwner && !isPoll && (
                                    <IdeaReaction messageId={message.id} bottom={-15} right={-24} />
                                )}
                            </View>
                        </View>
                        {!isPoll &&
                            (message.myX2 || message.myReaction || isOwner ? (
                                <>
                                    <View
                                        style={{ width: '90%', paddingLeft: 10, marginVertical: 6 }}
                                    >
                                        <Text
                                            style={{ ...styles.text, ...styles.h5, fontSize: 16 }}
                                        >
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
                                                        handleClickUser={handleClickUser}
                                                        handleClickHashtag={handleClickHashtag}
                                                    />
                                                )}
                                                keyExtractor={item => item.id + ''}
                                                showsVerticalScrollIndicator={false}
                                            />
                                        </View>
                                    ) : (
                                        <View
                                            style={{ ...stylescom.commentWrap, ...styles.center }}
                                        >
                                            <Text
                                                style={{ ...styles.text, ...stylescom.textGrayPad }}
                                            >
                                                Se el primero en contribuir a esta idea.
                                            </Text>
                                        </View>
                                    )}
                                    <InputComment
                                        messageId={messageId}
                                        toUser={message.user.id ? message.user.id : 0}
                                        updateComments={updateComments}
                                        form={form}
                                        onChange={onChange}
                                        refInputComment={refInputComment}
                                    />
                                </>
                            ) : (
                                <>
                                    <View
                                        style={{ width: '90%', paddingLeft: 10, marginVertical: 6 }}
                                    >
                                        <Text
                                            style={{ ...styles.text, ...styles.h5, fontSize: 16 }}
                                        >
                                            Comentarios
                                            <Text style={styles.orange}>.</Text>
                                        </Text>
                                    </View>
                                    <View style={{ ...stylescom.commentWrap, ...styles.center }}>
                                        <Text style={{ ...styles.text, ...stylescom.textGrayPad }}>
                                            Toma una postura antes de participar
                                        </Text>
                                    </View>
                                </>
                            ))}
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
        paddingBottom: 8,
        paddingRight: 25,
        paddingLeft: 32,
    },
    msg: {
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
    corner_container: {
        borderRadius: 14,
        position: 'absolute',
        height: 40,
        left: 0,
        right: 0,
        overflow: 'hidden',
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
    container_abs: {
        position: 'absolute',
        bottom: -2,
        right: 0,
    },
});
