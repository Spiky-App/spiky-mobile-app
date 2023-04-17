import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Modal,
    Pressable,
    StyleSheet,
    View,
    TouchableWithoutFeedback,
} from 'react-native';
import { styles } from '../themes/appTheme';
import { faPlus } from '../constants/icons/FontAwesome';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import EmojisKeyboard from './EmojisKeyboard';
import ReactionButton from './common/ReactionButton';

interface Positions {
    x: number;
    y: number;
}

interface Props {
    enableX2Reaction: boolean;
    enableEmojiReaction: boolean;
    handleCreateEmojiReaction?: (emoji: string) => void;
    handleCreateX2Reaction?: () => void;
}
export const IdeaReaction = ({
    enableX2Reaction,
    enableEmojiReaction,
    handleCreateEmojiReaction,
    handleCreateX2Reaction,
}: Props) => {
    const reactContainerRef = useRef<View>(null);
    const width = useRef(new Animated.Value(6)).current;
    const opacity1 = useRef(new Animated.Value(1)).current;
    const opacity2 = useRef(new Animated.Value(0)).current;
    const inputRange = [0, 100];
    const outputRange = ['10%', '100%'];
    const animatedWidth = width.interpolate({ inputRange, outputRange });
    const [modalReactions, setModalReactions] = useState(false);
    const [emojiKerboard, setEmojiKerboard] = useState(false);
    const [position, setPosition] = useState<Positions>({ x: 0, y: 0 });
    const { x, y } = position;

    function handleStateReactions() {
        reactContainerRef.current?.measure((px, py, pwidth, height, pageX, pageY) => {
            setPosition({ x: pageX, y: pageY });
        });
    }

    function handleCloseModal() {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(opacity2, {
                    toValue: 0,
                    duration: 50,
                    useNativeDriver: false,
                }),
                Animated.timing(width, {
                    toValue: 1.5,
                    duration: 200,
                    useNativeDriver: false,
                }),
            ]),
            Animated.timing(opacity1, {
                delay: 70,
                toValue: 1,
                duration: 50,
                useNativeDriver: false,
            }),
        ]).start(() => {
            setModalReactions(false);
        });
    }

    useEffect(() => {
        if (position.x !== 0) {
            setModalReactions(true);
            Animated.sequence([
                Animated.timing(opacity2, {
                    toValue: 1,
                    duration: 50,
                    useNativeDriver: false,
                }),
                Animated.parallel([
                    Animated.timing(opacity1, {
                        toValue: 0,
                        duration: 50,
                        useNativeDriver: false,
                    }),
                    Animated.timing(width, {
                        toValue: 91,
                        duration: 300,
                        useNativeDriver: false,
                    }),
                ]),
            ]).start();
        }
    }, [position]);

    return (
        <View style={stylescomp.bottom_container}>
            <View style={stylescomp.blur_container} />
            <View style={stylescomp.button_wrap}>
                <View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Pressable onPress={handleStateReactions}>
                            <Animated.View
                                style={[
                                    { ...stylescomp.container, opacity: opacity1 },
                                    modalReactions && { backgroundColor: '#67737D' },
                                ]}
                                ref={reactContainerRef}
                            >
                                <FontAwesomeIcon icon={faPlus} color={'white'} size={18} />
                            </Animated.View>
                        </Pressable>
                    </View>
                </View>
                <Modal animationType="fade" visible={modalReactions} transparent={true}>
                    <TouchableWithoutFeedback onPress={handleCloseModal}>
                        <View style={stylescomp.wrapModal}>
                            <TouchableWithoutFeedback>
                                <View
                                    style={[stylescomp.containerModal, { top: y, left: x - 342 }]}
                                >
                                    <Animated.View
                                        style={[stylescomp.containerbig, { width: animatedWidth }]}
                                    >
                                        <Animated.View
                                            style={{
                                                ...stylescomp.containersmall,
                                                opacity: opacity2,
                                            }}
                                        >
                                            <ReactionButton
                                                handleCreateEmojiReaction={
                                                    handleCreateEmojiReaction
                                                        ? handleCreateEmojiReaction
                                                        : () => {}
                                                }
                                                handleCreateX2Reaction={
                                                    handleCreateX2Reaction
                                                        ? handleCreateX2Reaction
                                                        : () => {}
                                                }
                                                enableX2Reaction={enableX2Reaction}
                                                enableEmojiReaction={enableEmojiReaction}
                                                setEmojiKerboard={setEmojiKerboard}
                                            />
                                        </Animated.View>
                                    </Animated.View>
                                </View>
                            </TouchableWithoutFeedback>
                            <EmojisKeyboard
                                isOpend={emojiKerboard}
                                setEmojiKerboard={setEmojiKerboard}
                                afterSelection={
                                    handleCreateEmojiReaction ? handleCreateEmojiReaction : () => {}
                                }
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        </View>
    );
};

const stylescomp = StyleSheet.create({
    bottom_container: {
        position: 'absolute',
        bottom: 6,
        right: 6,
        left: 0,
    },
    blur_container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        opacity: 0.7,
        borderRadius: 14,
    },
    button_wrap: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        flex: 1,
    },
    container: {
        ...styles.center,
        borderRadius: 10,
        backgroundColor: '#67737D',
        height: 32,
        minWidth: 42,
    },
    wrapModal: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    containerModal: {
        width: '100%',
        height: 32,
        alignItems: 'flex-end',
        position: 'absolute',
        paddingHorizontal: 6,
    },
    containerbig: {
        ...styles.center,
        ...styles.shadow_button,
        height: 32,
        miwidth: '100%',
        borderRadius: 10,
        backgroundColor: styles.button_container.backgroundColor,
        paddingHorizontal: 7,
        flexDirection: 'row',
        justifyContent: 'space-between',
        overflow: 'hidden',
    },
    containersmall: {
        paddingLeft: 8,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
