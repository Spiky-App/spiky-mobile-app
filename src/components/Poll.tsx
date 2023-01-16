import React, { useContext, useState } from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import SocketContext from '../context/Socket/Context';
import useSpikyService from '../hooks/useSpikyService';
import { RootState } from '../store';
import { setMessages } from '../store/feature/messages/messagesSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { styles } from '../themes/appTheme';
import { AnswerCount, Message } from '../types/store';

interface Props {
    messageId: number;
    userIdMessageOwner: number;
    answers: AnswerCount[];
    myAnswers?: number;
    totalAnswers: number;
}

export const Poll = ({
    answers,
    myAnswers,
    totalAnswers,
    messageId,
    userIdMessageOwner,
}: Props) => {
    const user = useAppSelector((state: RootState) => state.user);
    const messages = useAppSelector((state: RootState) => state.messages.messages);
    const { socket } = useContext(SocketContext);
    const { createAnswerPoll } = useSpikyService();
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const isOwner = user.id === userIdMessageOwner;

    async function handleAnswerPoll(id: number) {
        setIsLoading(true);
        const wasCreated = await createAnswerPoll(id);
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
            {answers.map(answer => (
                <View key={answer.id}>
                    <Pressable
                        style={stylescom.answer_button}
                        onPress={
                            !isOwner && !myAnswers && !isLoading
                                ? () => handleAnswerPoll(answer.id)
                                : undefined
                        }
                    >
                        <View
                            style={[
                                stylescom.circleBorder,
                                myAnswers || isOwner ? { borderColor: '#D4D4D4' } : {},
                            ]}
                        >
                            {myAnswers === answer.id && <View style={stylescom.circleInside} />}
                        </View>
                        <View style={{ flexGrow: 1 }}>
                            <Text style={[styles.text, stylescom.msg]}>{answer.answer}</Text>
                        </View>
                        {(myAnswers || isOwner) && (
                            <Text style={styles.textGray}>{answer.count}</Text>
                        )}
                    </Pressable>
                    <View style={stylescom.background_answer}>
                        {myAnswers && (
                            <View
                                style={{
                                    borderRadius: 6,
                                    flex: 1,
                                    width: `${(answer.count / totalAnswers) * 100}%`,
                                    backgroundColor:
                                        myAnswers === answer.id ? '#FC702A' : '#01192E',
                                }}
                            />
                        )}
                    </View>
                </View>
            ))}
            {(myAnswers || isOwner) && (
                <View style={[{ flex: 1, marginTop: 10 }]}>
                    <View style={{ width: '100%', backgroundColor: '#D4D4D4', height: 1.5 }} />
                    <Pressable style={[styles.center, { paddingTop: 5, width: '100%' }]}>
                        <Text style={styles.textGray}>Ver votos</Text>
                    </Pressable>
                </View>
            )}
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
        backgroundColor: 'white',
        borderRadius: 4,
        paddingVertical: 4,
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
        marginLeft: 18,
        backgroundColor: '#D4D4D4',
        borderRadius: 6,
    },
    text_button: {
        ...styles.text,
        color: '#01192e5a',
    },
});
