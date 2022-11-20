import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Modal, TouchableWithoutFeedback, View, TouchableOpacity, StyleSheet } from 'react-native';
import { faCheck, faXmark } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import { ReactionType } from '../types/store';
import useSpikyService from '../hooks/useSpikyService';
import { useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import SocketContext from '../context/Socket/Context';

interface ReactComment {
    against: number;
    favor: number;
    reactionCommentType: ReactionType | undefined;
}

interface Props {
    setModalReact: (value: boolean) => void;
    modalReact: boolean;
    position: {
        top: number;
        left: number;
    };
    commentId: number;
    messageId: number;
    userId: number;
    setReactComment: React.Dispatch<React.SetStateAction<ReactComment>>;
}

const reactioTypes: ['favor', 'against'] = ['favor', 'against'];

export const ModalReactComment = ({
    modalReact,
    setModalReact,
    position,
    commentId,
    messageId,
    userId,
    setReactComment,
}: Props) => {
    const uid = useAppSelector((state: RootState) => state.user.id);
    const { socket } = useContext(SocketContext);
    const { createReactionToComment } = useSpikyService();
    const { top, left } = position;

    const handleComment = async (reactionTypeAux: number) => {
        const wasCreated = await createReactionToComment(commentId, reactionTypeAux);
        if (wasCreated) {
            socket?.emit('notify', {
                id_usuario1: userId,
                id_usuario2: uid,
                id_mensaje: messageId,
                tipo: 5,
            });
            const newReactionType =
                reactionTypeAux === 1 ? ReactionType.FAVOR : ReactionType.AGAINST;
            setReactComment((value: ReactComment) => ({
                ...value,
                [reactioTypes[reactionTypeAux - 1]]: value[reactioTypes[reactionTypeAux - 1]] + 1,
                reactionCommentType: newReactionType,
            }));
        }
        setModalReact(false);
    };

    return (
        <Modal animationType="fade" visible={modalReact} transparent={true}>
            <TouchableWithoutFeedback onPress={() => setModalReact(false)}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <TouchableWithoutFeedback>
                        <View
                            style={{
                                backgroundColor: '#ffff',
                                paddingVertical: 8,
                                paddingHorizontal: 5,
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                elevation: 7,
                                borderRadius: 5,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                position: 'absolute',
                                flexDirection: 'row',
                                width: 150,
                                top: top - 52,
                                left: left + 5,
                            }}
                        >
                            <TouchableOpacity
                                style={stylescom.button}
                                onPress={() => handleComment(1)}
                            >
                                <FontAwesomeIcon icon={faCheck} size={20} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={stylescom.button}
                                onPress={() => handleComment(2)}
                            >
                                <FontAwesomeIcon icon={faXmark} size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const stylescom = StyleSheet.create({
    button: {
        ...styles.center,
        backgroundColor: '#01192E',
        paddingVertical: 3,
        borderRadius: 3,
        marginHorizontal: 5,
        flex: 1,
    },
});
