import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import {
    Modal,
    Text,
    Platform,
    StyleSheet,
    View,
    StyleProp,
    ViewStyle,
    Animated,
    TouchableWithoutFeedback,
} from 'react-native';
import { styles } from '../../themes/appTheme';
import { Pressable } from 'react-native';
import { faFaceSmile, faPlus } from '../../constants/icons/FontAwesome';
import EmojisKeyboard from '../EmojisKeyboard';
import { emojis1, emojis2 } from '../../constants/emojis/emojis';

interface Positions {
    x: number;
    y: number;
}

interface Props {
    scale?: number;
    styleCircleButton?: StyleProp<ViewStyle>;
    handleReaction: (emoji: string) => void;
    offsetPosition?: { offset_x: number; offset_y: number };
    changeColorOnPress?: boolean;
}

function ReactionButton({
    scale = 1,
    styleCircleButton = {},
    handleReaction,
    offsetPosition = { offset_x: 0, offset_y: 0 },
}: Props) {
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
    const { offset_x, offset_y } = offsetPosition;

    function handleStateReactions() {
        reactContainerRef.current?.measure((px, py, pwidth, height, pageX, pageY) => {
            setPosition({ x: pageX + offset_x, y: pageY + offset_y });
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
                    toValue: 3,
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
        <>
            <View style={styleCircleButton}>
                <View style={{ alignItems: 'flex-end' }}>
                    <Pressable onPress={handleStateReactions}>
                        <Animated.View
                            style={{
                                ...stylescomp.container,
                                opacity: opacity1,
                                height: 40 * scale,
                            }}
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
                            <View style={{ ...stylescomp.containerModal, top: y, left: x - 340 }}>
                                <Animated.View
                                    style={{
                                        ...stylescomp.containerbig,
                                        width: animatedWidth,
                                    }}
                                >
                                    <Animated.View
                                        style={{
                                            ...stylescomp.containersmall,
                                            opacity: opacity2,
                                        }}
                                    >
                                        <EmojiReaction
                                            fixedEmoji={'✅'}
                                            handleReaction={handleReaction}
                                        />
                                        <EmojiReaction
                                            fixedEmoji={'❌'}
                                            handleReaction={handleReaction}
                                        />
                                        <EmojiReaction
                                            fixedEmoji={'🔁'}
                                            handleReaction={handleReaction}
                                        />
                                        <EmojiReaction handleReaction={handleReaction} type={1} />
                                        <EmojiReaction handleReaction={handleReaction} />
                                        <EmojiReaction handleReaction={handleReaction} type={1} />
                                        <Pressable
                                            style={stylescomp.moreReactions}
                                            onPress={() => setEmojiKerboard(true)}
                                        >
                                            <FontAwesomeIcon
                                                icon={faFaceSmile}
                                                color={'white'}
                                                size={20}
                                            />
                                            <View style={stylescomp.plusIcon}>
                                                <FontAwesomeIcon
                                                    icon={faPlus}
                                                    color={'white'}
                                                    size={11}
                                                />
                                            </View>
                                        </Pressable>
                                    </Animated.View>
                                </Animated.View>
                            </View>
                        </TouchableWithoutFeedback>
                        <EmojisKeyboard
                            isOpend={emojiKerboard}
                            setEmojiKerboard={setEmojiKerboard}
                            afterSelection={handleReaction}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
}

interface EmojiReactionProps {
    fixedEmoji?: string;
    type?: number;
    handleReaction: (emoji: string) => void;
}
const EmojiReaction = ({ fixedEmoji, type, handleReaction }: EmojiReactionProps) => {
    const [emoji, setEmoji] = useState('');

    useEffect(() => {
        if (fixedEmoji) {
            setEmoji(fixedEmoji);
        } else if (type === 1) {
            setEmoji(emojis1[Math.floor(Math.random() * emojis1.length)]);
        } else {
            setEmoji(emojis2[Math.floor(Math.random() * emojis2.length)]);
        }
    }, []);

    return (
        <Pressable onPress={() => handleReaction(emoji)} style={{ flexGrow: 1 }}>
            <Text style={{ ...styles.text, fontSize: Platform.OS === 'ios' ? 22 : 18 }}>
                {emoji}
            </Text>
        </Pressable>
    );
};

export default ReactionButton;

const stylescomp = StyleSheet.create({
    container: {
        ...styles.center,
        borderRadius: 14,
        // paddingHorizontal: 15,
        minWidth: 50,
        backgroundColor: '#01192e2e',
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
        height: 40,
        alignItems: 'flex-end',
        position: 'absolute',
    },
    containerbig: {
        ...styles.center,
        ...styles.shadow_button,
        height: 40,
        width: '100%',
        borderRadius: 14,
        backgroundColor: '#01192e2e',
        padding: 7,
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
    moreReactions: {
        ...styles.center,
        paddingVertical: 2,
        paddingRight: 8,
    },
    plusIcon: {
        position: 'absolute',
        top: -3,
        right: 1,
    },
});
