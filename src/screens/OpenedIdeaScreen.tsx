import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Linking,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Pressable,
} from 'react-native';
import { Comment } from '../components/Comment';
import { faChevronLeft } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';

import { FormComment, InputComment } from '../components/InputComment';
import { useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigator/Navigator';
import { Comment as CommentState, Message, User } from '../types/store';
import { LoadingAnimated } from '../components/svg/LoadingAnimated';
import { useForm } from '../hooks/useForm';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { CommonActions, NavigationProp, useNavigation } from '@react-navigation/native';
import useSpikyService from '../hooks/useSpikyService';
import { MessageRequestData } from '../services/models/spikyService';
import { generateMessageFromMensaje } from '../helpers/message';
import { faReply } from '@fortawesome/free-solid-svg-icons/faReply';
import { IdeaTypes } from '../components/ideas/IdeaTypes';

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
    anonymous: false,
};

type Props = DrawerScreenProps<RootStackParamList, 'OpenedIdeaScreen'>;

export const OpenedIdeaScreen = ({ route: routeSC }: Props) => {
    const { id: uid, nickname } = useAppSelector((state: RootState) => state.user);
    const spectatorMode = useAppSelector((state: RootState) => state.ui.spectatorMode);
    const ideaId = routeSC.params?.ideaId;
    const filter = routeSC.params?.filter;
    const { top, bottom } = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [idea, setIdea] = useState<Message>(initialMessage);
    const [totalComments, setTotalComments] = useState<number>(idea.totalComments);
    const [messageTrackingId, setMessageTrackingId] = useState<number | undefined>();
    const { form, onChange } = useForm<FormComment>(DEFAULT_FORM);
    const refInputComment = React.createRef<TextInput>();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [comments, setComments] = useState<CommentState[]>();
    const isOwner = idea.user.id === uid;
    const { getIdeaWithComments } = useSpikyService();

    const handleOpenIdea = async () => {
        const ideaRetrieved = await getIdeaWithComments(ideaId);
        if (ideaRetrieved) {
            const messageRetrived = generateMessageFromMensaje(ideaRetrieved);
            setIdea(messageRetrived);
            setComments(messageRetrived.comments ?? []);
            setMessageTrackingId(messageRetrived.messageTrackingId);
            setTotalComments(messageRetrived.totalComments);
        } else {
            navigation.goBack();
        }
        setLoading(false);
    };

    const updateComments = (comment: CommentState) => {
        if (comments) {
            setComments([comment, ...comments]);
            setTotalComments(comments.length + 1);
        }
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

    async function handleClickLink(url: string) {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert('URL no soportado.');
        }
    }

    useEffect(() => {
        if (ideaId) {
            handleOpenIdea();
        }
    }, [ideaId]);

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
                                <IdeaTypes
                                    idea={{ ...idea, totalComments, messageTrackingId }}
                                    filter={filter || ''}
                                    isOwner={uid === idea.user.id}
                                    handleClickUser={handleClickUser}
                                    handleClickHashtag={handleClickHashtag}
                                    handleClickLink={handleClickLink}
                                    handleOpenIdea={handleOpenIdea}
                                    isOpenedIdeaScreen
                                    spectatorMode={spectatorMode}
                                />
                            </View>
                        </View>
                        {idea.myAnswers || idea.myX2 || idea.myReaction || isOwner ? (
                            <>
                                <View style={stylescom.container_replyPriv}>
                                    <Text style={{ ...styles.text, ...styles.h5, fontSize: 16 }}>
                                        Comentarios
                                        <Text style={styles.orange}>.</Text>
                                    </Text>
                                    {!idea.anonymous && !isOwner && (
                                        <Pressable
                                            style={[styles.button_container, styles.shadow_button]}
                                            onPress={() =>
                                                navigation.navigate('ReplyIdeaScreen', {
                                                    message: {
                                                        ideaId: idea.id,
                                                        message: idea.message,
                                                        user: idea.user,
                                                        date: idea.date,
                                                    },
                                                })
                                            }
                                        >
                                            <FontAwesomeIcon
                                                icon={faReply}
                                                color={styles.text_button.color}
                                                size={14}
                                            />
                                            <Text style={{ ...styles.text_button, marginLeft: 5 }}>
                                                Replicar en priv
                                            </Text>
                                        </Pressable>
                                    )}
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
                                                    handleClickLink={handleClickLink}
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
                                    messageId={ideaId}
                                    toUser={idea.user.id ? idea.user.id : 0}
                                    updateComments={updateComments}
                                    form={form}
                                    onChange={onChange}
                                    refInputComment={refInputComment}
                                />
                            </>
                        ) : (
                            <>
                                <View style={{ width: '90%', paddingLeft: 10, marginVertical: 6 }}>
                                    <Text style={{ ...styles.text, ...styles.h5, fontSize: 16 }}>
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
        paddingBottom: 8,
        paddingRight: 25,
        paddingLeft: 32,
    },
    msg: {
        // width: '100%',
        ...styles.text,
        textAlign: 'left',
        flexShrink: 1,
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
        width: '92%',
        borderRadius: 14,
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
    container_replyPriv: {
        width: '90%',
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
