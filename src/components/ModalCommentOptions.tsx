import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, TouchableWithoutFeedback, View, Animated } from 'react-native';
import { useAnimation } from '../hooks/useAnimation';
import { styles } from '../themes/appTheme';
import ReactionButton from './common/ReactionButton';
import EmojisKeyboard from './EmojisKeyboard';

interface Props {
    setModalCommentOptions: (value: boolean) => void;
    modalCommentOptions: boolean;
    handleCreateEmojiReactionComment?: (emoji: string) => void;
}

export const ModalCommentOptions = ({
    setModalCommentOptions,
    modalCommentOptions,
    handleCreateEmojiReactionComment,
}: Props) => {
    const [emojiKerboard, setEmojiKerboard] = useState(false);
    const { movingPosition, position } = useAnimation({
        init_position: 0,
    });

    function handleCloseModal() {
        movingPosition(0, 750, 400, () => setModalCommentOptions(false));
    }

    useEffect(() => {
        if (modalCommentOptions) {
            movingPosition(750, 0, 700);
        }
    }, [modalCommentOptions]);

    return (
        <Modal animationType="fade" visible={modalCommentOptions} transparent={true}>
            <TouchableWithoutFeedback onPressOut={handleCloseModal}>
                <View style={styles.backmodal}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={{
                                ...stylescom.container,
                                transform: [{ translateY: position }],
                            }}
                        >
                            <View style={stylescom.optionEmojis}>
                                <ReactionButton
                                    handleCreateEmojiReaction={
                                        handleCreateEmojiReactionComment
                                            ? handleCreateEmojiReactionComment
                                            : () => {}
                                    }
                                    handleCreateX2Reaction={() => {}}
                                    enableX2Reaction={false}
                                    enableEmojiReaction={true}
                                    setEmojiKerboard={setEmojiKerboard}
                                    setModalOptions={setModalCommentOptions}
                                />
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
            <EmojisKeyboard
                isOpend={emojiKerboard}
                setEmojiKerboard={setEmojiKerboard}
                afterSelection={
                    handleCreateEmojiReactionComment ? handleCreateEmojiReactionComment : () => {}
                }
                setModalIdeaOptions={setModalCommentOptions}
            />
        </Modal>
    );
};

const stylescom = StyleSheet.create({
    container: {
        height: '20%',
        width: '100%',
        backgroundColor: '#ffff',
        paddingHorizontal: 25,
        paddingVertical: 20,
        position: 'absolute',
        bottom: 0,
        flex: 1,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
    },
    option: {
        ...styles.flex_start,
        backgroundColor: styles.button_container.backgroundColor,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        width: '100%',
    },
    optionEmojis: {
        ...styles.flex_start,
        backgroundColor: styles.button_container.backgroundColor,
        borderRadius: 12,
        paddingVertical: 5,
        paddingHorizontal: 15,
        marginBottom: 20,
        width: '100%',
    },
});
