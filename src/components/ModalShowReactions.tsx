import React, { useEffect, useState } from 'react';
import {
    Modal,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    Text,
    FlatList,
    Pressable,
    Animated,
} from 'react-native';
import {
    generateCommentReactionFromRespReaccion,
    generateReactionFromReaccion,
} from '../helpers/reaction';
import { useAnimation } from '../hooks/useAnimation';
import useSpikyService from '../hooks/useSpikyService';
import { styles } from '../themes/appTheme';
import { Reaction, ReactionCount, User } from '../types/store';
import UniversityTag from './common/UniversityTag';
import { LoadingAnimated } from './svg/LoadingAnimated';

interface Props {
    setModalReactions: (value: boolean) => void;
    modalReactions: boolean;
    id: number;
    reactionCount: ReactionCount[];
    handleClickUser: (goToUser: User) => void;
    isIdeaReactions?: boolean;
    isCommetReactions?: boolean;
}

export const ModalShowReactions = ({
    id,
    modalReactions,
    setModalReactions,
    reactionCount,
    handleClickUser,
    isIdeaReactions,
}: Props) => {
    const [loading, setLoading] = useState(false);
    const [selection, setSelection] = useState('');
    const [reactions, setReactions] = useState<Reaction[]>([]);
    const [filteredReactions, setFilteredReactions] = useState<Reaction[]>([]);
    const { getIdeaReactions, getCommentReactions } = useSpikyService();
    const { opacity, position, movingPosition, fadeIn, fadeOut } = useAnimation({
        init_position: 650,
    });

    function countReactions() {
        let totalReactions: number = 0;
        reactionCount.forEach(reaction => {
            totalReactions = reaction.count + totalReactions;
        });
        return totalReactions;
    }

    function handleCloseModal() {
        movingPosition(0, 650, 400, () => setModalReactions(false));
    }

    async function loadIdeaReactions() {
        if (isIdeaReactions) {
            const reacciones = await getIdeaReactions(id);
            const reactionList = reacciones.map(reaccion => generateReactionFromReaccion(reaccion));
            setReactions(reactionList);
        } else {
            const reacciones = await getCommentReactions(id);
            const reactionList = reacciones.map(reaccion =>
                generateCommentReactionFromRespReaccion(reaccion)
            );
            setReactions(reactionList);
        }
        setSelection('Todos');
        setLoading(false);
    }

    useEffect(() => {
        if (modalReactions) {
            setLoading(true);
            loadIdeaReactions();
        }
        return () => setReactions([]);
    }, [modalReactions]);

    useEffect(() => {
        if (modalReactions) {
            movingPosition(650, 0, 700);
        }
    }, [modalReactions]);

    useEffect(() => {
        fadeOut(200, () => {
            setFilteredReactions(
                selection !== 'Todos' ? reactions.filter(r => r.reaction === selection) : reactions
            );
            fadeIn(200);
        });
    }, [selection]);

    const Reactions = () =>
        reactions?.length !== 0 ? (
            <Animated.View style={{ opacity }}>
                <FlatList
                    style={{ marginBottom: 20 }}
                    data={filteredReactions}
                    renderItem={({ item }) => (
                        <ReactionComp
                            reaction={item}
                            handleClickUser={handleClickUser}
                            setModalReactions={setModalReactions}
                        />
                    )}
                    keyExtractor={item => item.id + ''}
                    showsVerticalScrollIndicator={false}
                />
            </Animated.View>
        ) : (
            <View style={{ ...styles.center, flex: 1 }}>
                <Text
                    style={{
                        ...styles.text,
                        ...styles.textGrayPad,
                        textAlign: 'center',
                    }}
                >
                    No hay idea que no cause reacción.
                </Text>
            </View>
        );

    return (
        <Modal animationType="fade" visible={modalReactions} transparent={true}>
            <TouchableWithoutFeedback onPressOut={handleCloseModal}>
                <View style={styles.backmodal}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={{
                                ...stylescom.container,
                                transform: [{ translateY: position }],
                            }}
                        >
                            <View style={stylescom.containerCount}>
                                <FlatList
                                    horizontal
                                    data={reactionCount}
                                    renderItem={({ item }) => (
                                        <ReactionItem
                                            reaction={item.reaction}
                                            count={item.count}
                                            selected={selection === item.reaction}
                                            setSelection={setSelection}
                                        />
                                    )}
                                    ListHeaderComponent={
                                        <ReactionItem
                                            reaction={'Todos'}
                                            count={countReactions()}
                                            selected={selection === 'Todos'}
                                            setSelection={setSelection}
                                        />
                                    }
                                    keyExtractor={item => item.reaction}
                                    contentContainerStyle={stylescom.flatListCount}
                                    showsHorizontalScrollIndicator={true}
                                />
                            </View>

                            <View style={stylescom.subContainer}>
                                {loading ? (
                                    <View style={{ ...styles.center, flex: 1 }}>
                                        <LoadingAnimated />
                                    </View>
                                ) : (
                                    <Reactions />
                                )}
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

interface ReactionCompProps {
    reaction: Reaction;
    handleClickUser: (goToUser: User) => void;
    setModalReactions: (value: boolean) => void;
}
const ReactionComp = ({ reaction, handleClickUser, setModalReactions }: ReactionCompProps) => {
    function goToUserProfile() {
        handleClickUser(reaction.user);
        setModalReactions(false);
    }

    return (
        <View style={stylescom.reactContainer}>
            <Text style={stylescom.reaction}>{reaction.reaction}</Text>
            <View style={styles.flex}>
                <Pressable onPress={goToUserProfile}>
                    <Text style={{ ...stylescom.user, ...styles.textbold }}>
                        @{reaction.user.nickname}
                    </Text>
                </Pressable>
                <UniversityTag id={reaction.user.universityId} fontSize={14} />
            </View>
        </View>
    );
};

interface ReactionItemProps {
    reaction: string;
    count: number;
    selected?: boolean;
    setSelection: (value: string) => void;
}

const ReactionItem = ({ reaction, count, selected, setSelection }: ReactionItemProps) => {
    return (
        <Pressable style={{ marginRight: 15 }} onPress={() => setSelection(reaction)}>
            <Text style={stylescom.text}>{reaction + ' ' + count}</Text>
            <View
                style={{ ...stylescom.line, backgroundColor: selected ? '#FC702A' : 'transparent' }}
            />
        </Pressable>
    );
};

const stylescom = StyleSheet.create({
    container: {
        height: 340,
        width: '100%',
        backgroundColor: '#ffff',
        borderRadius: 5,
        paddingHorizontal: 25,
        position: 'absolute',
        bottom: 0,
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
        marginHorizontal: 5,
        flex: 1,
        marginBottom: 5,
    },
    reactContainer: {
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    user: {
        ...styles.textbold,
        fontWeight: '600',
        fontSize: 14,
    },
    reaction: {
        ...styles.text,
        fontSize: 25,
        marginRight: 6,
    },
    text: {
        ...styles.numberGray,
        fontSize: 16,
        paddingVertical: 3,
    },
    flatListCount: {
        alignItems: 'flex-end',
    },
    line: {
        borderRadius: 5,
        height: 4,
        marginTop: 5,
    },
});
