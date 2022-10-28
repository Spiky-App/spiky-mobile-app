import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { getTime } from '../helpers/getTime';
import { transformMsg } from '../helpers/transformMsg';
import { useAnimation } from '../hooks/useAnimation';
import { styles } from '../themes/appTheme';
import { ChatMessage as ChatMessageProp } from '../types/store';
import UniversityTag from './common/UniversityTag';

interface MessageProp {
    msg: ChatMessageProp;
    uid: number;
}

export const ChatMessage = ({ msg, uid }: MessageProp) => {
    const { opacity, fadeIn } = useAnimation({ init_opacity: 0 });
    const owner = msg.userId === uid;
    const time = getTime(msg.date.toString());
    const replyMessage = transformMsg(msg.replyMessage?.message || '');

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
            <View>
                {msg.replyMessage && (
                    <View style={stylescomp.containerReplyMsg}>
                        <View style={{ flexDirection: 'row', marginBottom: 3 }}>
                            <Text style={{ ...styles.textbold, fontSize: 12 }}>
                                @{msg.replyMessage.user.nickname}
                            </Text>
                            <UniversityTag id={msg.replyMessage.user.universityId} fontSize={12} />
                        </View>
                        <Text style={{ ...styles.text, fontSize: 12 }}>
                            {replyMessage.length > 73
                                ? replyMessage.substring(0, 73) + '...'
                                : replyMessage}
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
                        <Text style={stylescomp.text}>{msg.message}</Text>
                    </View>
                    <View>
                        <Text style={stylescomp.time}>{time}</Text>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
};

const stylescomp = StyleSheet.create({
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
