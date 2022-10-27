import React, { useEffect, useState } from 'react';
import { Text, TouchableWithoutFeedback } from 'react-native';
import { styles } from '../themes/appTheme';
import { User } from '../types/store';

interface Props {
    text: string;
    textStyle: {};
    handleClickUser: (goToUser: User) => void;
    handleClickHashtag: (hashtag_text: string) => void;
}

const MsgTransform = ({ text, textStyle, handleClickUser, handleClickHashtag }: Props) => {
    const [content, setContent] = useState<Element>(<Text></Text>);

    useEffect(() => {
        if (text !== '') {
            const regexp_all = /(@\[@\w*\]\(\d*\))|(#\[#[A-Za-zÀ-ÖØ-öø-ÿ]+\]\(\d*\))/g;
            const regexp_mention = /(@\[@\w*\]\(\d*\))/g;
            const regexp_hashtag = /(#\[#[A-Za-zÀ-ÖØ-öø-ÿ]+\]\(\d*\))/g;
            const match_regularExp = text.match(regexp_all);
            const mensaje_split = text.split(regexp_all);
            let component: Element;

            if (match_regularExp) {
                component = mensaje_split.map((string, index) => {
                    if (regexp_mention.test(string)) {
                        const alias = string.substring(
                            string.indexOf('[') + 1,
                            string.indexOf(']')
                        );
                        return (
                            <TouchableWithoutFeedback
                                key={index}
                                style={{ alignItems: 'flex-end' }}
                                onPress={() =>
                                    handleClickUser({
                                        nickname: alias.replace('@', ''),
                                        universityId: 0,
                                    })
                                }
                            >
                                <Text style={{ ...textStyle, ...styles.h5 }}>{alias}</Text>
                            </TouchableWithoutFeedback>
                        );
                    } else if (regexp_hashtag.test(string)) {
                        const hashtag = string.substring(
                            string.indexOf('[') + 1,
                            string.indexOf(']')
                        );
                        const hashtag_text = hashtag.replace('#', '');
                        return (
                            <TouchableWithoutFeedback
                                key={index}
                                style={{ ...textStyle, backgroundColor: 'red' }}
                                onPress={() => handleClickHashtag(hashtag_text)}
                            >
                                <Text style={{ ...textStyle, ...styles.h5 }}>
                                    <Text style={{ ...textStyle, ...styles.h5, ...styles.orange }}>
                                        #
                                    </Text>
                                    {hashtag_text}
                                </Text>
                            </TouchableWithoutFeedback>
                        );
                    } else {
                        return (
                            <Text style={{ ...textStyle }} key={index}>
                                {string}
                            </Text>
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
