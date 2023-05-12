import { faPenFancy } from '../constants/icons/FontAwesome';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect } from 'react';
import {
    Modal,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    Animated,
    Text,
    Pressable,
} from 'react-native';
import { useAnimation } from '../hooks/useAnimation';
import { styles } from '../themes/appTheme';
import ReactionButton from './common/ReactionButton';

interface Props {
    setModalQuoteAndX2Options: (value: boolean) => void;
    modalQuoteAndX2Options: boolean;
    handleCreateX2Reaction?: () => void;
    handleOpenCreateQuoteScreen: () => void;
}

export const ModalQuoteAndX2Options = ({
    setModalQuoteAndX2Options,
    modalQuoteAndX2Options,
    handleCreateX2Reaction,
    handleOpenCreateQuoteScreen,
}: Props) => {
    const { movingPosition, position } = useAnimation({
        init_position: 0,
    });

    function handleCloseModal() {
        movingPosition(0, 950, 400, () => setModalQuoteAndX2Options(false));
    }

    useEffect(() => {
        if (modalQuoteAndX2Options) {
            movingPosition(950, 0, 700);
        }
    }, [modalQuoteAndX2Options]);

    return (
        <Modal animationType="fade" visible={modalQuoteAndX2Options} transparent={true}>
            <TouchableWithoutFeedback onPressOut={handleCloseModal}>
                <View style={styles.backmodal}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={{
                                ...stylescom.container,
                                transform: [{ translateY: position }],
                            }}
                        >
                            <Reactions
                                handleCreateX2Reaction={handleCreateX2Reaction}
                                enableX2Reaction={true}
                                enableEmojiReaction={false}
                                setEmojiKerboard={() => {}}
                                setModalOptions={setModalQuoteAndX2Options}
                            />
                            <QuoteOption
                                handleOpenCreateQuoteScreen={() => {
                                    setModalQuoteAndX2Options(false);
                                    handleOpenCreateQuoteScreen();
                                }}
                            />
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

interface QuoteOptionProps {
    handleOpenCreateQuoteScreen: () => void;
}
const QuoteOption = ({ handleOpenCreateQuoteScreen }: QuoteOptionProps) => (
    <Pressable style={stylescom.option} onPress={handleOpenCreateQuoteScreen}>
        <FontAwesomeIcon icon={faPenFancy} color="#01192E" size={16} style={{ marginRight: 10 }} />
        <Text style={styles.h4}>Citar idea</Text>
    </Pressable>
);

interface ReactionsProps {
    setModalOptions?: (value: boolean) => void;
    handleCreateEmojiReaction?: (emoji: string) => void;
    handleCreateX2Reaction?: () => void;
    enableX2Reaction: boolean;
    enableEmojiReaction: boolean;
    setEmojiKerboard: (value: boolean) => void;
}
const Reactions = ({
    setModalOptions,
    handleCreateEmojiReaction,
    handleCreateX2Reaction,
    enableX2Reaction,
    enableEmojiReaction,
    setEmojiKerboard,
}: ReactionsProps) => (
    <View style={stylescom.optionEmojis}>
        <ReactionButton
            handleCreateEmojiReaction={
                handleCreateEmojiReaction ? handleCreateEmojiReaction : () => {}
            }
            handleCreateX2Reaction={handleCreateX2Reaction ? handleCreateX2Reaction : () => {}}
            enableX2Reaction={enableX2Reaction}
            enableEmojiReaction={enableEmojiReaction}
            setEmojiKerboard={setEmojiKerboard}
            setModalOptions={setModalOptions}
        />
    </View>
);

const stylescom = StyleSheet.create({
    container: {
        height: 'auto',
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
