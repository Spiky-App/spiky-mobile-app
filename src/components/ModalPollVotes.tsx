import { faTrophy, faXmark } from '../constants/icons/FontAwesome';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    Text,
    Pressable,
    Animated,
    FlatList,
} from 'react-native';
import { generateAnswerFromRespuesta } from '../helpers/answer';
import { useAnimation } from '../hooks/useAnimation';
import useSpikyService from '../hooks/useSpikyService';
import { styles } from '../themes/appTheme';
import { Answer, User } from '../types/store';
import UniversityTag from './common/UniversityTag';
import NetworkErrorFeed from './NetworkErrorFeed';
import { LoadingAnimated } from './svg/LoadingAnimated';
import ButtonIcon from './common/ButtonIcon';

interface Props {
    setModalAnswers: (value: boolean) => void;
    modalAnswers: boolean;
    messageId: number;
    handleClickUser: (goToUser: User) => void;
}

export const ModalPollVotes = ({
    messageId,
    modalAnswers,
    setModalAnswers,
    handleClickUser,
}: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [networkError, setNetworkError] = useState(false);
    const { getPollAnswers } = useSpikyService();
    const { position, movingPosition, fadeIn, opacity } = useAnimation({
        init_position: 0,
    });

    function handleCloseModal() {
        movingPosition(0, 750, 400, () => setModalAnswers(false));
    }

    async function loadPollAnswers() {
        setIsLoading(true);
        const { data, networkError: networkErrorReturn } = await getPollAnswers(messageId);
        if (networkErrorReturn) setNetworkError(true);
        const reactionList = data
            .map(a => generateAnswerFromRespuesta(a))
            .sort((a, b) => b.count - a.count);
        setAnswers(reactionList);
        setIsLoading(false);
    }

    useEffect(() => {
        if (modalAnswers) {
            setIsLoading(true);
            movingPosition(750, 0, 700);
            loadPollAnswers();
        }
        return () => setAnswers([]);
    }, [modalAnswers]);

    useEffect(() => {
        if (answers.length > 0) {
            fadeIn();
        }
    }, [answers]);

    return (
        <Modal animationType="fade" visible={modalAnswers} transparent={true}>
            <TouchableWithoutFeedback onPressOut={handleCloseModal}>
                <View style={styles.backmodal}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={{
                                ...stylescom.container,
                                transform: [{ translateY: position }],
                            }}
                        >
                            {networkError && <NetworkErrorFeed callback={loadPollAnswers} />}

                            {isLoading && (
                                <View style={{ ...styles.center, flex: 1 }}>
                                    <LoadingAnimated />
                                </View>
                            )}
                            {!isLoading && !networkError && (
                                <Animated.View style={{ opacity, flex: 1 }}>
                                    <FlatList
                                        // style={stylescomp.wrap}
                                        style={stylescom.subContainer}
                                        data={answers}
                                        renderItem={({ item, index }) => (
                                            <AnswerOption
                                                answer={item}
                                                index={index}
                                                handleClickUser={handleClickUser}
                                                setModalAnswers={setModalAnswers}
                                            />
                                        )}
                                        keyExtractor={item => item.answer + ''}
                                        showsVerticalScrollIndicator={false}
                                        contentContainerStyle={{ flexGrow: 1 }}
                                        ListHeaderComponent={
                                            <View style={stylescom.title}>
                                                <Text style={styles.h4}>
                                                    Votos de la encuesta
                                                    <Text style={styles.orange}>.</Text>
                                                </Text>
                                                <ButtonIcon
                                                    disabled={isLoading}
                                                    icon={faXmark}
                                                    onPress={handleCloseModal}
                                                    style={stylescom.close_button}
                                                />
                                            </View>
                                        }
                                    />
                                </Animated.View>
                            )}
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
interface AnswerOptionProps {
    answer: Answer;
    index: number;
    handleClickUser: (goToUser: User) => void;
    setModalAnswers: (value: boolean) => void;
}

const AnswerOption = ({ answer, index, handleClickUser, setModalAnswers }: AnswerOptionProps) => {
    return (
        <Pressable style={{ paddingTop: 20, flexGrow: 1 }}>
            <View style={stylescom.option}>
                <View style={{ flex: 1 }}>
                    <Text style={stylescom.text_option}>
                        {answer.answer.length > 70
                            ? answer.answer.substring(0, 70) + '...'
                            : answer.answer}
                    </Text>
                </View>
                <View
                    style={{
                        ...styles.flex_center,
                        marginLeft: 5,
                    }}
                >
                    {index === 0 && answer.count > 0 && (
                        <FontAwesomeIcon icon={faTrophy} color={'#01192E'} size={14} />
                    )}
                    <Text style={stylescom.number}>{answer.count}</Text>
                </View>
            </View>

            <View style={stylescom.container_votes}>
                <FlatList
                    // style={stylescomp.wrap}
                    data={answer.votes}
                    renderItem={({ item }) => (
                        <VoteComp
                            user={item}
                            handleClickUser={handleClickUser}
                            setModalAnswers={setModalAnswers}
                        />
                    )}
                    keyExtractor={item => item.nickname + ''}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                />
            </View>
        </Pressable>
    );
};

interface VoteCompProps {
    user: User;
    handleClickUser: (goToUser: User) => void;
    setModalAnswers: (value: boolean) => void;
}
const VoteComp = ({ user, handleClickUser, setModalAnswers }: VoteCompProps) => {
    function goToUserProfile() {
        handleClickUser(user);
        setModalAnswers(false);
    }

    return (
        <View style={{ ...styles.flex, marginVertical: 5 }}>
            <Pressable onPress={goToUserProfile}>
                <Text style={styles.user}>@{user.nickname}</Text>
            </Pressable>
            <UniversityTag id={user.universityId} fontSize={13} />
        </View>
    );
};

const stylescom = StyleSheet.create({
    container: {
        height: '80%',
        width: '100%',
        backgroundColor: '#ffff',
        borderRadius: 5,
        paddingHorizontal: 25,
        paddingBottom: 15,
        position: 'absolute',
        bottom: 0,
        flex: 1,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
    },
    containerCount: {
        marginTop: 2,
        paddingTop: 5,
        borderBottomColor: '#d4d4d4b7',
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    subContainer: {
        flexGrow: 1,
        marginTop: 20,
        marginHorizontal: 5,
        flex: 1,
        marginBottom: 20,
    },
    container_votes: {
        marginTop: 5,
        borderColor: '#D4D4D4',
        borderWidth: 1,
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 8,
        minHeight: 38,
    },
    option: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 5,
    },
    number: {
        ...styles.textGray,
        marginLeft: 6,
        fontSize: 16,
    },
    title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginHorizontal: 1,
    },
    close_button: {
        height: 24,
        width: 24,
        backgroundColor: '#D4D4D4',
    },
    text_option: {
        ...styles.text,
        fontSize: 16,
    },
});
