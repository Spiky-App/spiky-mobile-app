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
import IconGray from '../svg/IconGray';
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
    changeColorOnPress,
}: Props) {
    const reactContainerRef = useRef<View>(null);
    const width = useRef(new Animated.Value(20)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const inputRange = [0, 100];
    const outputRange = ['0%', '100%'];
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
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 0,
                duration: 150,
                useNativeDriver: false,
            }),
            Animated.timing(width, {
                toValue: 20,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start(() => {
            setModalReactions(false);
        });
    }

    useEffect(() => {
        if (position.x !== 0) {
            setModalReactions(true);
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: false,
                }),
                Animated.timing(width, {
                    toValue: 100,
                    duration: 500,
                    useNativeDriver: false,
                }),
            ]).start();
        }
    }, [position]);

    return (
        <>
            <View style={styleCircleButton}>
                <View style={{ alignItems: 'flex-end' }}>
                    <View
                        style={{
                            ...stylescomp.container,
                            minWidth: 42 * scale,
                            height: 42 * scale,
                            padding: 7 * scale,
                            backgroundColor:
                                changeColorOnPress && modalReactions ? '#01192E' : '#D4D4D4',
                        }}
                        ref={reactContainerRef}
                    >
                        <Pressable onPress={handleStateReactions}>
                            <View
                                style={{ position: 'absolute', top: 3 * scale, left: -2 * scale }}
                            >
                                <FontAwesomeIcon icon={faPlus} color={'white'} size={11 * scale} />
                            </View>
                            <IconGray color="#ffffff" underlayColor={'#01192ebe'} />
                        </Pressable>
                    </View>
                </View>
            </View>

            <Modal animationType="fade" visible={modalReactions} transparent={true}>
                <TouchableWithoutFeedback onPress={handleCloseModal}>
                    <View style={stylescomp.wrapModal}>
                        <TouchableWithoutFeedback>
                            <View style={{ ...stylescomp.containerModal, top: y, left: x - 159 }}>
                                <Animated.View
                                    style={{
                                        ...stylescomp.containerbig,
                                        width: animatedWidth,
                                    }}
                                >
                                    <Animated.View
                                        style={{
                                            ...stylescomp.containersmall,
                                            opacity,
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
                                        <EmojiReaction handleReaction={handleReaction} />
                                        <EmojiReaction handleReaction={handleReaction} />
                                        <Pressable
                                            style={stylescomp.moreReactions}
                                            onPress={() => setEmojiKerboard(true)}
                                        >
                                            <FontAwesomeIcon
                                                icon={faFaceSmile}
                                                color={'white'}
                                                size={17}
                                            />
                                            <View style={stylescomp.plusIcon}>
                                                <FontAwesomeIcon
                                                    icon={faPlus}
                                                    color={'white'}
                                                    size={10}
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
        <Pressable onPress={() => handleReaction(emoji)}>
            <Text style={{ ...styles.text, fontSize: Platform.OS === 'ios' ? 20 : 18 }}>
                {emoji}
            </Text>
        </Pressable>
    );
};

export default ReactionButton;

const stylescomp = StyleSheet.create({
    container: {
        ...styles.center,
        ...styles.shadow_button,
        borderRadius: 20,
    },
    wrapModal: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    containerModal: {
        width: 200,
        height: 42,
        alignItems: 'flex-end',
        position: 'absolute',
        ...styles.shadow_button,
    },
    containerbig: {
        ...styles.center,
        ...styles.shadow_button,
        height: 42,
        width: 200,
        borderRadius: 20,
        backgroundColor: '#D4D4D4',
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
        paddingRight: 9,
    },
    plusIcon: {
        position: 'absolute',
        top: -3,
        right: 1,
    },
});
