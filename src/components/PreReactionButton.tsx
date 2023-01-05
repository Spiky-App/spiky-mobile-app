import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    Pressable,
    Animated,
    Modal,
    TouchableWithoutFeedback,
    Text,
    Platform,
} from 'react-native';
import { styles } from '../themes/appTheme';
import IconGray from './svg/IconGray';
import { faPlus, faFaceSmile } from '../constants/icons/FontAwesome';
import { emojis1, emojis2 } from '../constants/emojis/emojis';
import useSpikyService from '../hooks/useSpikyService';
import EmojisKeyboard from './EmojisKeyboard';
import { Message } from '../types/store';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import SocketContext from '../context/Socket/Context';
import { setMessages } from '../store/feature/messages/messagesSlice';

interface Positions {
    x: number;
    y: number;
}

interface Props {
    bottom: number;
    right: number;
    messageId: number;
}
export const PreReactionButton = ({ bottom, right, messageId }: Props) => {
    const messages = useAppSelector((state: RootState) => state.messages.messages);
    const user = useAppSelector((state: RootState) => state.user);
    const dispatch = useAppDispatch();
    const { socket } = useContext(SocketContext);
    const width = useRef(new Animated.Value(20)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const inputRange = [0, 100];
    const outputRange = ['0%', '100%'];
    const animatedWidth = width.interpolate({ inputRange, outputRange });
    const reactContainerRef = useRef<View>(null);
    const [modalReactions, setModalReactions] = useState(false);
    const [emojiKerboard, setEmojiKerboard] = useState(false);
    const { createReactionMsg } = useSpikyService();
    const [position, setPosition] = useState<Positions>({ x: 0, y: 0 });
    const { x, y } = position;

    function handleStateReactions() {
        reactContainerRef.current?.measure((px, py, pwidth, height, pageX, pageY) => {
            setPosition({ x: pageX, y: pageY });
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

    async function handleReaction(reaction: string[0]) {
        const wasCreated = await createReactionMsg(messageId, reaction, user.id);
        if (wasCreated) {
            const messagesUpdated = messages.map((msg: Message) => {
                if (msg.id === messageId) {
                    socket?.emit('notify', {
                        id_usuario1: msg.user.id,
                        id_usuario2: user.id,
                        id_mensaje: msg.id,
                        tipo: 1,
                    });
                    let isNew = true;
                    let reactions = msg.reactions.map(r => {
                        if (r.reaction === reaction) {
                            isNew = false;
                            return {
                                reaction: r.reaction,
                                count: r.count + 1,
                            };
                        } else {
                            return r;
                        }
                    });
                    if (isNew) {
                        reactions = [...reactions, { reaction, count: 1 }];
                    }
                    return {
                        ...msg,
                        reactions,
                        myReaction: reaction,
                    };
                } else {
                    return msg;
                }
            });
            dispatch(setMessages(messagesUpdated));
        }
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
            <View style={{ position: 'absolute', bottom, right, alignItems: 'flex-end' }}>
                <View
                    style={{
                        ...stylescomp.container,
                        width: 42,
                    }}
                    ref={reactContainerRef}
                >
                    <Pressable onPress={handleStateReactions}>
                        <View style={{ position: 'absolute', top: 1, left: -3 }}>
                            <FontAwesomeIcon icon={faPlus} color={'white'} size={11} />
                        </View>
                        <IconGray color="#ffffff" underlayColor={'#01192ebe'} />
                    </Pressable>
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
                                            <View
                                                style={{ position: 'absolute', top: 0, right: 1 }}
                                            >
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
};

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

const stylescomp = StyleSheet.create({
    container: {
        ...styles.center,
        ...styles.shadow_button,
        height: 42,
        minWidth: 42,
        borderRadius: 20,
        backgroundColor: '#D4D4D4',
        padding: 7,
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
        paddingRight: 8,
    },
});
