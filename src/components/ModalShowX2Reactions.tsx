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
import { generateX2ReactionFromX2Reaccion } from '../helpers/reaction';
import { useAnimation } from '../hooks/useAnimation';
import useSpikyService from '../hooks/useSpikyService';
import { styles } from '../themes/appTheme';
import { User, X2Reaction } from '../types/store';
import UniversityTag from './common/UniversityTag';
import { LoadingAnimated } from './svg/LoadingAnimated';

interface Props {
    setModalX2Reactions: (value: boolean) => void;
    modalX2Reactions: boolean;
    totalX2: number;
    messageId: number;
    handleClickUser: (goToUser: User) => void;
}

export const ModalShowX2Reactions = ({
    messageId,
    modalX2Reactions,
    setModalX2Reactions,
    totalX2,
    handleClickUser,
}: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [x2Reactions, setX2Reactions] = useState<X2Reaction[]>([]);
    const { getX2Rections } = useSpikyService();
    const { opacity, position, movingPosition, fadeIn } = useAnimation({
        init_position: 650,
    });

    function handleCloseModal() {
        movingPosition(0, 650, 400, () => setModalX2Reactions(false));
    }

    async function loadX2Reactions() {
        const x2reacciones = await getX2Rections(messageId);
        const reactionList = x2reacciones.map(x2reaccion =>
            generateX2ReactionFromX2Reaccion(x2reaccion)
        );
        setX2Reactions(reactionList);
        setIsLoading(false);
        fadeIn();
    }

    useEffect(() => {
        if (modalX2Reactions) {
            setIsLoading(true);
            movingPosition(650, 0, 700);
            loadX2Reactions();
        }
        return () => setX2Reactions([]);
    }, [modalX2Reactions]);

    useEffect(() => {
        console.log(x2Reactions);
    }, [x2Reactions]);

    const Reactions = () =>
        x2Reactions?.length !== 0 ? (
            <Animated.View style={{ opacity }}>
                <FlatList
                    style={{ marginBottom: 20 }}
                    data={x2Reactions}
                    renderItem={({ item }) => (
                        <X2ReactionComp
                            reaction={item}
                            handleClickUser={handleClickUser}
                            setModalX2Reactions={setModalX2Reactions}
                        />
                    )}
                    keyExtractor={item => item.xNummber + ''}
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
        <Modal animationType="fade" visible={modalX2Reactions} transparent={true}>
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
                                <Text style={{ ...stylescom.x2, fontSize: 23 }}>
                                    X{totalX2 + 1}
                                </Text>
                            </View>
                            <View style={stylescom.subContainer}>
                                {isLoading ? (
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

interface X2ReactionCompProps {
    reaction: X2Reaction;
    handleClickUser: (goToUser: User) => void;
    setModalX2Reactions: (value: boolean) => void;
}
const X2ReactionComp = ({
    reaction,
    handleClickUser,
    setModalX2Reactions,
}: X2ReactionCompProps) => {
    function goToUserProfile() {
        handleClickUser(reaction.user);
        setModalX2Reactions(false);
    }

    return (
        <View style={stylescom.reactContainer}>
            <Text style={stylescom.x2}>{`X${reaction.xNummber + 1}`}</Text>
            <View style={styles.flex}>
                <Pressable onPress={goToUserProfile}>
                    <Text style={{ ...stylescom.user, ...styles.textbold }}>
                        @{reaction.user.nickname}
                    </Text>
                </Pressable>
                <UniversityTag id={reaction.user.universityId} fontSize={15} />
            </View>
        </View>
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
        paddingVertical: 7,
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
        fontSize: 16,
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
    x2: {
        ...styles.textbold,
        fontSize: 18,
        color: '#67737D',
        marginRight: 2,
        paddingHorizontal: 4,
    },
});
