import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { styles } from '../themes/appTheme';
import { User } from '../types/store';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLink } from '../constants/icons/FontAwesome';

interface Props {
    text: string;
    textStyle: {};
    handleClickUser: (goToUser: User) => void;
    handleClickHashtag: (hashtag_text: string) => void;
    handleClickLink: (url: string) => Promise<void>;
}

const MsgTransform = ({
    text,
    textStyle,
    handleClickUser,
    handleClickHashtag,
    handleClickLink,
}: Props) => {
    const [content, setContent] = useState<Element>(<Text></Text>);

    useEffect(() => {
        if (text !== '') {
            const regexp_all =
                /(@\[@\w*\]\(\d*\))|(#\[#[A-Za-zÀ-ÖØ-öø-ÿ]+\]\(\d*\))|((?:https?:\/\/(www\.)?)?[\w-]+\.\w+\/?[\w\?\.\=\&\-\#\+\/]+)/g;
            const regexp_mention = /(@\[@\w*\]\(\d*\))/g;
            const regexp_hashtag = /(#\[#[A-Za-zÀ-ÖØ-öø-ÿ]+\]\(\d*\))/g;
            const regexp_link = /((?:https?:\/\/www\.?)?[\w-]+\.\w+\/?[\w\?\.\=\&\-\#\+\/]+)/g;
            const match_regularExp = text.match(regexp_all);
            let component: Element;

            if (match_regularExp) {
                const mensaje_split = text.replace('www.', '').split(regexp_all);
                component = mensaje_split.map((string, index) => {
                    if (regexp_mention.test(string)) {
                        const alias = string.substring(
                            string.indexOf('[') + 1,
                            string.indexOf(']')
                        );
                        return (
                            <Pressable
                                key={index}
                                style={stylescomp.text_wrap}
                                onPress={() =>
                                    handleClickUser({
                                        nickname: alias.replace('@', ''),
                                        universityId: 0,
                                    })
                                }
                            >
                                <Text style={{ ...textStyle, ...styles.h5 }}>{alias}</Text>
                            </Pressable>
                        );
                    } else if (regexp_hashtag.test(string)) {
                        const hashtag = string.substring(
                            string.indexOf('[') + 1,
                            string.indexOf(']')
                        );
                        const hashtag_text = hashtag.replace('#', '');
                        return (
                            <Pressable
                                key={index}
                                style={stylescomp.text_wrap}
                                onPress={() => handleClickHashtag(hashtag_text)}
                            >
                                <Text style={{ ...textStyle, ...styles.h5 }}>
                                    <Text style={{ ...textStyle, ...styles.h5, ...styles.orange }}>
                                        #
                                    </Text>
                                    {hashtag_text}
                                </Text>
                            </Pressable>
                        );
                    } else if (regexp_link.test(string)) {
                        const linkOfficial =
                            string.search(/(https?:\/\/)/g) >= 0 ? string : 'https://' + string;
                        const linkRetrieve = string.replace(/(https?:\/\/)?(www\.)?/g, '');
                        const link = linkRetrieve.substring(
                            0,
                            linkRetrieve.indexOf('/') >= 0
                                ? linkRetrieve.indexOf('/')
                                : linkRetrieve.length
                        );
                        return (
                            <TouchableWithoutFeedback
                                key={index}
                                style={{ alignItems: 'flex-end' }}
                                onPress={() => handleClickLink(linkOfficial)}
                            >
                                <View style={stylescomp.text_wrap}>
                                    <FontAwesomeIcon
                                        icon={faLink}
                                        color={styles.link.color}
                                        size={14}
                                        style={{ marginRight: 2 }}
                                    />
                                    <Text
                                        style={{
                                            ...textStyle,
                                            ...styles.textbold,
                                            color: styles.link.color,
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {link}
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        );
                    } else {
                        return (
                            <View style={stylescomp.text_wrap}>
                                <Text style={textStyle} key={index}>
                                    {string}
                                </Text>
                            </View>
                        );
                    }
                });
                setContent(component);
            } else {
                setContent(<Text style={textStyle}>{text}</Text>);
            }
        }
    }, [text]);

    return (
        <Text style={{ flexDirection: 'row' }}>
            <>{content}</>
        </Text>
    );
};

export default MsgTransform;

const stylescomp = StyleSheet.create({
    text_wrap: {
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});
