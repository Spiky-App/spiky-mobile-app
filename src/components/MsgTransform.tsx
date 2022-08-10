import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { styles } from '../themes/appTheme';

interface Props {
    text: string;
    textStyle: {};
}

const MsgTransform = ({ text, textStyle }: Props) => {
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
                            <TouchableOpacity
                                key={index}
                                style={{ alignItems: 'flex-end' }}
                                onPress={() => {}}
                                // ${alias.replace('@', '')}
                            >
                                <Text style={{ ...textStyle, ...styles.h5 }}>{alias}</Text>
                            </TouchableOpacity>
                        );
                    } else if (regexp_hashtag.test(string)) {
                        const hashtag = string.substring(
                            string.indexOf('[') + 1,
                            string.indexOf(']')
                        );
                        return (
                            <TouchableOpacity
                                key={index}
                                style={{ ...textStyle }}
                                onPress={() => {}}
                                // ${hashtag.replace('#', '')}
                            >
                                <Text style={{ ...textStyle, ...styles.h5 }}>
                                    <Text style={{ ...textStyle, ...styles.h5, ...styles.orange }}>
                                        #
                                    </Text>
                                    {hashtag.replace('#', '')}
                                </Text>
                            </TouchableOpacity>
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