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
import { faChevronLeft, faLightbulb, faMessage, faThumbtack } from '../constants/icons/FontAwesome';
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
import { PreReactionButton } from '../components/PreReactionButton';
import ReactionsContainer from '../components/common/ReactionsContainer';
import { PreModalIdeaOptions } from '../components/PreModalIdeaOptions';
import { MessageRequestData } from '../services/models/spikyService';

const DEFAULT_FORM: FormComment = {
    comment: '',
};

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
        universityId: 0,
    },
    answersNumber: 0,
    draft: 0,
    sequence: 1,
    reactions: [],
};

type Props = DrawerScreenProps<RootStackParamList, 'OpenedIdeaScreen'>;

export const OpenedIdeaScreen = ({ route: routeSC }: Props) => {
    const { id: uid, nickname } = useAppSelector((state: RootState) => state.user);
    const messageId = routeSC.params?.messageId;
    const filter = routeSC.params?.filter;
    const { top, bottom } = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<Message>(initialMessage);
    const [answersNumber, setAnswersNumber] = useState<number>(message.answersNumber);
    const [messageTrackingId, setMessageTrackingId] = useState<number | undefined>();
    const { form, onChange } = useForm<FormComment>(DEFAULT_FORM);
    const refInputComment = React.createRef<TextInput>();
    const navigation = useNavigation<any>();
    const [comments, setComments] = useState<CommentState[]>();
    const date = getTime(message.date.toString());
    const isOwner = message.user.id === uid;
    const { getIdeaWithComments } = useSpikyService();

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
                                    <TouchableOpacity onPress={() => handleClickUser(message.user)}>
                                        <Text style={{ ...styles.user, fontSize: 14 }}>
                                            @{message.user.nickname}
                                        </Text>
                                    </TouchableOpacity>
                                    <UniversityTag id={message.user.universityId} fontSize={14} />
                                </View>

                                <View style={{ marginVertical: 8 }}>
                                    <MsgTransform
                                        textStyle={{
                                            ...styles.text,
                                            ...stylescom.msg,
                                            fontSize: 14,
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
                                    {!message.myReaction && !isOwner ? (
                                        <>
                                            <View style={{ flex: 1, height: 15 }} />
                                            <PreReactionButton
                                                messageId={message.id}
                                                bottom={-15}
                                                right={-25}
                                                left={-25}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <View style={stylescom.container}>
                                                {message.reactions.length > 0 && (
                                                    <ReactionsContainer
                                                        reactionCount={message.reactions}
                                                        myReaction={message.myReaction}
                                                        messageId={message.id}
                                                        handleClickUser={handleClickUser}
                                                    />
                                                )}

                                                <View style={stylescom.reaction}>
                                                    <FontAwesomeIcon
                                                        icon={faMessage}
                                                        color={'#D4D4D4'}
                                                        size={14}
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

                                                <PreModalIdeaOptions
                                                    myIdea={isOwner}
                                                    message={{
                                                        messageId: message.id,
                                                        message: message.message,
                                                        user: message.user,
                                                        messageTrackingId,
                                                        date: message.date,
                                                    }}
                                                    filter={filter}
                                                    setMessageTrackingId={setMessageTrackingId}
                                                />
                                            </View>
                                        </>
                                    )}
                                </View>
                            </View>
                        </View>

                        {message.myReaction !== undefined || isOwner ? (
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
                                                    handleClickUser={handleClickUser}
                                                    handleClickHashtag={handleClickHashtag}
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
    corner_container: {
        borderRadius: 8,
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
});
