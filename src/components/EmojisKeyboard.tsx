import React, { useEffect } from 'react';
import { Animated, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import { useAnimation } from '../hooks/useAnimation';
import { styles } from '../themes/appTheme';

interface Props {
    isOpend: boolean;
    setEmojiKerboard: (value: boolean) => void;
    afterSelection: (emoji: string) => void;
}
const EmojisKeyboard = ({ isOpend, setEmojiKerboard, afterSelection }: Props) => {
    const { position, movingPosition } = useAnimation({ init_position: 650 });

    function handleCloseModal() {
        movingPosition(0, 650, 400, () => setEmojiKerboard(false));
    }

    function handleSelection(emoji: string) {
        movingPosition(0, 650, 400, () => afterSelection(emoji));
    }

    useEffect(() => {
        if (isOpend) {
            movingPosition(650, 0, 700);
        }
    }, [isOpend]);

    if (!isOpend) return <></>;

    return (
        <TouchableWithoutFeedback onPress={handleCloseModal} style={{ zIndex: 2 }}>
            <View style={stylescomp.backmodal}>
                <Animated.View
                    style={{ ...stylescomp.container, transform: [{ translateY: position }] }}
                >
                    <TouchableWithoutFeedback>
                        <EmojiSelector
                            onEmojiSelected={emoji => handleSelection(emoji)}
                            category={Categories.emotion}
                        />
                    </TouchableWithoutFeedback>
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default EmojisKeyboard;

const stylescomp = StyleSheet.create({
    container: {
        ...styles.shadow,
        shadowOffset: {
            width: 0,
            height: -10,
        },
        paddingTop: 10,
        height: 500,
        width: '100%',
        backgroundColor: '#ffff',
        borderRadius: 5,
        position: 'absolute',
        bottom: 0,
    },
    backmodal: {
        ...styles.backmodal,
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
});
