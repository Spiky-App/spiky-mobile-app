import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useRef } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View, Keyboard } from 'react-native';
import { getTime } from '../helpers/getTime';
import { transformMsg } from '../helpers/transformMsg';
import { useAnimation } from '../hooks/useAnimation';
import { styles } from '../themes/appTheme';
import { ChatMessage as ChatMessageProp, ChatMessageToReply, User } from '../types/store';
import UniversityTag from './common/UniversityTag';
import { faReply } from '../constants/icons/FontAwesome';
import { useAppSelector } from '../store/hooks';
import { RootState } from '../store';

interface MessageProp {
    msg: ChatMessageProp;
    user: User;
    setMessageToReply: (value: ChatMessageToReply) => void;
}

export const ChatMessage = ({ msg, user, setMessageToReply }: MessageProp) => {
    const uid = useAppSelector((state: RootState) => state.user.id);
    const { opacity, fadeIn } = useAnimation({ init_opacity: 0 });
    const owner = msg.userId === uid;
    const time = getTime(msg.date.toString());
    const replyMessage = transformMsg(msg.replyMessage?.message || '');
    const opacityReplyIcon = useRef(new Animated.Value(0)).current;
    const pan = useRef(new Animated.ValueXY()).current;
    const totalMoveToRight = 50;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                if (gestureState.dx > 0) {
                    Animated.timing(opacityReplyIcon, {
                        toValue: gestureState.dx / totalMoveToRight,
                        duration: 100,
                        useNativeDriver: false,
                    }).start();
                    return Animated.event([null, { dx: pan.x }], { useNativeDriver: false })(
                        evt,
                        gestureState
                    );
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dx > totalMoveToRight) {
                    setMessageToReply({
                        messageId: msg.id,
                        user: user,
                        message: msg.message,
                    });
                } else if (gestureState.dx === 0) Keyboard.dismiss();
                if (opacityReplyIcon._value > 0) opacityReplyIcon.setValue(0);
                Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
            },
        })
    ).current;

    useEffect(() => {
        fadeIn(300);
    }, []);

    return (
        <Animated.View
            style={[
                owner ? stylescomp.containerMessageRight : stylescomp.containerMessageLeft,
                { opacity },
            ]}
        >
            <Animated.View
                style={{ transform: [{ translateX: pan.x }], flexDirection: 'row' }}
                {...panResponder.panHandlers}
            >
                <Animated.View
                    style={{ ...stylescomp.containerReplyIcon, opacity: opacityReplyIcon }}
                >
                    <View style={stylescomp.replyIcon}>
                        <FontAwesomeIcon icon={faReply} color={'white'} size={10} />
                    </View>
                </Animated.View>
                <View>
                    {msg.replyMessage && (
                        <View style={stylescomp.containerReplyMsg}>
                            <View style={{ flexDirection: 'row', marginBottom: 3 }}>
                                <Text style={{ ...styles.textbold, fontSize: 12 }}>
                                    @{msg.replyMessage.user.nickname}
                                </Text>
                                <UniversityTag
                                    id={msg.replyMessage.user.universityId}
                                    fontSize={12}
                                />
                            </View>
                            <Text style={{ ...styles.text, fontSize: 12 }}>
                                {replyMessage.length > 73
                                    ? replyMessage.substring(0, 73) + '...'
                                    : replyMessage}
                            </Text>
                        </View>
                    )}
                    {msg.reply && (
                        <View style={stylescomp.containerReplyMsg}>
                            <View style={{ flexDirection: 'row', marginBottom: 3 }}>
                                <Text style={{ ...styles.textbold, fontSize: 12 }}>
                                    @{msg.reply.user.nickname}
                                </Text>
                                <UniversityTag id={msg.reply.user.universityId} fontSize={12} />
                            </View>
                            <Text style={{ ...styles.text, fontSize: 12 }}>
                                {msg.reply.message.length > 73
                                    ? msg.reply.message.substring(0, 73) + '...'
                                    : msg.reply.message}
                            </Text>
                        </View>
                    )}
                    <View
                        style={{
                            ...stylescomp.message,
                            justifyContent: owner ? 'flex-end' : 'flex-start',
                            flexWrap: msg.message.length > 20 ? 'wrap' : 'nowrap',
                        }}
                    >
                        <View>
                            <Text style={styles.text}>{msg.message}</Text>
                        </View>
                        <View>
                            <Text style={stylescomp.time}>{time}</Text>
                        </View>
                    </View>
                </View>
            </Animated.View>
        </Animated.View>
    );
};

const stylescomp = StyleSheet.create({
    containerReplyIcon: {
        position: 'absolute',
        justifyContent: 'center',
        top: 0,
        bottom: 0,
        left: -25,
    },
    replyIcon: {
        backgroundColor: '#01192E',
        justifyContent: 'center',
        borderRadius: 10,
        padding: 2,
        paddingLeft: 3,
        height: 18,
        width: 18,
    },
    containerMessageRight: {
        marginVertical: 8,
        alignItems: 'flex-end',
    },
    containerMessageLeft: {
        marginVertical: 8,
        alignItems: 'flex-start',
    },
    message: {
        ...styles.shadow,
        maxWidth: 280,
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: 'white',
        alignContent: 'center',
        flexDirection: 'row',
        minHeight: 'auto',
    },
    text: {
        ...styles.text,
        fontSize: 14,
    },
    time: {
        ...styles.textGray,
        textAlign: 'right',
        paddingLeft: 5,
        marginTop: 2,
        left: 0,
        width: '100%',
    },
    containerReplyMsg: {
        backgroundColor: '#e8e6e6',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        maxWidth: 280,
    },
});
