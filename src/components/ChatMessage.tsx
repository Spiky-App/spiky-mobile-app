import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getTime } from '../helpers/getTime';
import { transformMsg } from '../helpers/transformMsg';
import { styles } from '../themes/appTheme';
import { ChatMessage as ChatMessageProp } from '../types/store';

interface MessageProp {
    msg: ChatMessageProp;
    uid: number;
}

export const ChatMessage = ({ msg, uid }: MessageProp) => {
    const owner = msg.userId === uid;
    const time = getTime(msg.date.toString());
    const replyMessage = transformMsg(msg.replyMessage?.message || '');

    return (
        <View style={owner ? stylescomp.containerMessageRight : stylescomp.containerMessageLeft}>
            <View>
                {msg.replyMessage && (
                    <View style={stylescomp.containerReplyMsg}>
                        <View style={{ flexDirection: 'row', marginBottom: 3 }}>
                            <Text style={{ ...styles.textbold, fontSize: 12 }}>
                                @{msg.replyMessage.user.nickname}
                            </Text>
                            <Text style={{ ...styles.text, fontSize: 12 }}> de </Text>
                            <Text style={{ ...styles.text, fontSize: 12 }}>
                                {msg.replyMessage.user.university.shortname}
                            </Text>
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
                    }}
                >
                    <Text style={stylescomp.text}>{msg.message}</Text>
                    <Text style={stylescomp.time}>{time}</Text>
                </View>
            </View>
        </View>
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
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor: 'white',
        flexWrap: 'wrap',
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
    },
    containerReplyMsg: {
        backgroundColor: '#e8e6e6',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        maxWidth: 280,
    },
});