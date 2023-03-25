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
    styleCircleButton?: StyleProp<ViewStyle>;
    handleReaction: (emoji: string) => void;
    handleCreateIdeaX2?: () => void;
    offsetPosition?: { offset_x: number; offset_y: number };
    changeColorOnPress?: boolean;
    isComment?: boolean;
}

function ReactionButton({
    styleCircleButton = {},
    handleReaction,
    handleCreateIdeaX2,
    offsetPosition = { offset_x: 0, offset_y: 0 },
    isComment,
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
                    duration: isComment ? 50 : 200,
                    useNativeDriver: false,
                }),
            ]),
            Animated.timing(opacity1, {
                delay: isComment ? 0 : 70,
                toValue: 1,
                duration: isComment ? 1 : 50,
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
                            style={[
                                isComment
                                    ? stylescomp.containerInComment
                                    : { ...stylescomp.container, opacity: opacity1 },
                                {
                                    height: isComment ? 20 : 40,
                                    minWidth: isComment ? 20 : 50,
                                },
                                modalReactions && { backgroundColor: '#67737D' },
                            ]}
                            ref={reactContainerRef}
                        >
                            <FontAwesomeIcon
                                icon={faPlus}
                                color={'white'}
                                size={isComment ? 14 : 18}
                            />
                        </Animated.View>
                    </Pressable>
                </View>
            </View>

            <Modal animationType="fade" visible={modalReactions} transparent={true}>
                <TouchableWithoutFeedback onPress={handleCloseModal}>
                    <View style={stylescomp.wrapModal}>
                        <TouchableWithoutFeedback>
                            <View
                                style={[
                                    stylescomp.containerModal,
                                    { top: y, left: !isComment ? x - 340 : 0 },
                                    isComment && { alignItems: 'center' },
                                ]}
                            >
                                <Animated.View
                                    style={[
                                        stylescomp.containerbig,
                                        { width: animatedWidth },
                                        isComment && { backgroundColor: '#D4D4D4' },
                                    ]}
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
                                        <EmojiReaction handleReaction={handleReaction} type={1} />
                                        <EmojiReaction handleReaction={handleReaction} />
                                        <Pressable
                                            style={{ ...stylescomp.moreReactions, marginRight: 6 }}
                                            onPress={() => setEmojiKerboard(true)}
                                        >
                                            <View>
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
                                            </View>
                                        </Pressable>
                                        {handleCreateIdeaX2 && (
                                            <>
                                                <View
                                                    style={{
                                                        width: 1,
                                                        minHeight: '80%',
                                                        backgroundColor: 'white',
                                                    }}
                                                />
                                                <Pressable
                                                    style={stylescomp.moreReactions}
                                                    onPress={handleCreateIdeaX2}
                                                >
                                                    <Text style={stylescomp.textX2}>X2</Text>
                                                </Pressable>
                                            </>
                                        )}
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
        <Pressable onPress={() => handleReaction(emoji)} style={stylescomp.emojiContainer}>
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
        backgroundColor: '#01192e2e',
    },
    containerInComment: {
        ...styles.shadow_button,
        ...styles.center,
        shadowOffset: {
            width: 1,
            height: 2,
        },
        borderRadius: 14,
        backgroundColor: '#D4D4D4',
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
    moreReactions: {
        ...styles.center,
        paddingVertical: 2,
        flexGrow: 1,
        minHeight: '100%',
    },
    emojiContainer: {
        flexGrow: 1,
        minHeight: '100%',
        ...styles.center,
    },
    plusIcon: {
        position: 'absolute',
        top: -7,
        right: -6,
    },
    textX2: {
        ...styles.h4,
        fontSize: 22,
        color: 'white',
    },
});
