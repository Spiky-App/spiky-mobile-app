import React, { useEffect, useContext, useRef, useState } from 'react';
import { Text, View, Pressable, StyleSheet, Animated, FlatList } from 'react-native';
import SocketContext from '../context/Socket/Context';
import useSpikyService from '../hooks/useSpikyService';
import { RootState } from '../store';
import { setMessages } from '../store/feature/messages/messagesSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { styles } from '../themes/appTheme';
import { AnswerCount, Message, User } from '../types/store';
import { CommentsButton } from './common/CommentsButton';
import { ModalPollVotes } from './ModalPollVotes';
import { faSquarePollHorizontal } from '../constants/icons/FontAwesome';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

interface Props {
    messageId: number;
    userIdMessageOwner: number;
    answers: AnswerCount[];
    myAnswers?: number;
    totalAnswers: number;
    totalComments: number;
    handleOpenIdea?: () => void;
    handleClickUser: (goToUser: User) => void;
    isAnonymous: boolean;
}

export const Poll = ({
    answers,
    myAnswers,
    totalAnswers,
    messageId,
    userIdMessageOwner,
    handleOpenIdea,
    totalComments,
    handleClickUser,
    isAnonymous,
}: Props) => {
    const user = useAppSelector((state: RootState) => state.user);
    const messages = useAppSelector((state: RootState) => state.messages.messages);
    const { socket } = useContext(SocketContext);
    const { createPollAnswer } = useSpikyService();
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [modalAnswers, setModalAnswers] = useState(false);
    const isOwner = user.id === userIdMessageOwner;
    const height = useRef(new Animated.Value(0)).current;
    const inputRange = [0, 100];
    const outputRange = [0, 100];
    const heightAnimated = height.interpolate({ inputRange, outputRange });

    function handleSeeVotesAnimation() {
        Animated.timing(height, {
            toValue: 25,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }

    useEffect(() => {
        if (myAnswers || isOwner) {
            handleSeeVotesAnimation();
        }
    }, [myAnswers, isOwner]);

    async function handleAnswerPoll(id: number) {
        setIsLoading(true);
        const wasCreated = await createPollAnswer(id);
        if (wasCreated) {
            const messagesUpdated = messages.map((msg: Message) => {
                if (msg.id === messageId) {
                    socket?.emit('notify', {
                        id_usuario1: userIdMessageOwner,
                        id_usuario2: user.id,
                        id_mensaje: messageId,
                        tipo: 7,
                    });
                    const newAnswers = msg.answers?.map(a => {
                        if (id === a.id) {
                            return { ...a, count: a.count + 1 };
                        } else {
                            return a;
                        }
                    });
                    return {
                        ...msg,
                        answers: newAnswers,
                        myAnswers: id,
                        totalAnswers: totalAnswers + 1,
                    };
                } else {
                    return msg;
                }
            });
            dispatch(setMessages(messagesUpdated));
        }
        setIsLoading(false);
    }

    return (
        <View style={{ flex: 1, marginTop: 12 }}>
            <FlatList
                data={answers}
                renderItem={({ item }) => (
                    <PollBar
                        answer={item}
                        myAnswers={myAnswers}
                        isOwner={isOwner}
                        totalAnswers={totalAnswers}
                        isLoading={isLoading}
                        handleAnswerPoll={handleAnswerPoll}
                        isOwnerAndAnonymous={isOwner && isAnonymous}
                    />
                )}
                keyExtractor={item => item.answer}
                showsVerticalScrollIndicator={false}
            />
            {myAnswers || (isOwner && !isAnonymous) ? (
                <Animated.View style={[{ marginTop: 15, minHeight: heightAnimated }]}>
                    <View style={{ width: '100%', backgroundColor: '#D4D4D4', height: 1.5 }} />

                    <View style={stylescom.container}>
                        <Pressable
                            style={styles.button_container}
                            onPress={() => setModalAnswers(true)}
                        >
                            <FontAwesomeIcon
                                icon={faSquarePollHorizontal}
                                color={'#67737D'}
                                size={14}
                            />
                            <Text style={{ ...stylescom.number, marginLeft: 4 }}>Votos</Text>
                        </Pressable>
                        <CommentsButton callback={handleOpenIdea} totalComments={totalComments} />
                    </View>

                    <ModalPollVotes
                        messageId={messageId}
                        modalAnswers={modalAnswers}
                        setModalAnswers={setModalAnswers}
                        handleClickUser={handleClickUser}
                    />
                </Animated.View>
            ) : (
                <View style={{ height: 10 }} />
            )}
        </View>
    );
};

interface PollBarProps {
    answer: AnswerCount;
    myAnswers?: number;
    isOwner: boolean;
    totalAnswers: number;
    isLoading: boolean;
    handleAnswerPoll: (answerId: number) => void;
    isOwnerAndAnonymous: boolean;
}

const PollBar = ({
    answer,
    myAnswers,
    isOwner,
    totalAnswers,
    isLoading,
    handleAnswerPoll,
    isOwnerAndAnonymous,
}: PollBarProps) => {
    const width = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const inputRange = [0, 100];
    const maxOutputRange = totalAnswers > 0 ? (answer.count / totalAnswers) * 100 : 0;
    const outputRange = ['0%', '100%'];
    const animatedWidth = width.interpolate({ inputRange, outputRange });

    function handlePollBarAnimation() {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: false,
            }),
            Animated.timing(width, {
                toValue: maxOutputRange,
                duration: 2000,
                useNativeDriver: false,
            }),
        ]).start();
    }

    useEffect(() => {
        if (myAnswers || isOwner) {
            handlePollBarAnimation();
        }
    }, [myAnswers, isOwner]);

    return (
        <View key={answer.id} style={{ flex: 1 }}>
            <Pressable
                style={stylescom.answer_button}
                onPress={
                    (!isOwner || isOwnerAndAnonymous) && !myAnswers && !isLoading
                        ? () => handleAnswerPoll(answer.id)
                        : undefined
                }
            >
                <View
                    style={[
                        stylescom.circleBorder,
                        myAnswers || (isOwner && !isOwnerAndAnonymous)
                            ? { borderColor: '#D4D4D4' }
                            : {},
                    ]}
                >
                    {myAnswers === answer.id && <View style={stylescom.circleInside} />}
                </View>
                <View style={{ flexGrow: 1, flex: 1 }}>
                    <Text style={[styles.text, stylescom.msg]}>{answer.answer}</Text>
                </View>
                {(myAnswers || (isOwner && !isOwnerAndAnonymous)) && (
                    <Animated.View style={{ ...styles.center, marginLeft: 5, opacity }}>
                        <Text style={styles.textGray}>{answer.count}</Text>
                    </Animated.View>
                )}
            </Pressable>
            <View style={{ alignItems: 'flex-end' }}>
                <View style={stylescom.background_answer}>
                    {(myAnswers || isOwner) && (
                        <Animated.View
                            style={{
                                borderRadius: 6,
                                flex: 1,
                                width: animatedWidth,
                                backgroundColor: myAnswers === answer.id ? '#FC702A' : '#01192E',
                            }}
                        />
                    )}
                </View>
            </View>
        </View>
    );
};

const stylescom = StyleSheet.create({
    msg: {
        ...styles.text,
        textAlign: 'left',
        flexShrink: 1,
    },
    answer_button: {
        borderRadius: 4,
        paddingVertical: 5,
        flexDirection: 'row',
    },
    suboption: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        width: '100%',
        borderRadius: 4,
        flexDirection: 'row',
    },
    suboptionSelected: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#01192E',
        width: '100%',
        borderRadius: 3,
        flexDirection: 'row',
    },
    circleBorder: {
        ...styles.center,
        height: 16,
        width: 16,
        borderWidth: 1.6,
        borderColor: '#01192E',
        borderRadius: 10,
        backgroundColor: 'white',
        marginRight: 6,
    },
    circleInside: {
        height: 16,
        width: 16,
        backgroundColor: '#D4D4D4',
        borderRadius: 10,
    },
    background_answer: {
        width: '95%',
        height: 8,
        backgroundColor: '#D4D4D4',
        borderRadius: 6,
    },
    text_button: {
        ...styles.text,
        color: '#01192e5a',
    },
    container: {
        marginTop: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    number: {
        ...styles.text,
        fontSize: 12,
        color: '#67737D',
        marginLeft: 1,
    },
});
