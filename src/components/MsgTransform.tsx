import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Text, TouchableWithoutFeedback } from 'react-native';
import { RootState } from '../store';
import { useAppSelector } from '../store/hooks';
import { styles } from '../themes/appTheme';
import { MessageRequestData } from '../services/models/spikyService';

interface Props {
    text: string;
    textStyle: {};
}

const MsgTransform = ({ text, textStyle }: Props) => {
    const nickname = useAppSelector((state: RootState) => state.user.nickname);
    const [content, setContent] = useState<Element>(<Text></Text>);
    const navigation = useNavigation<any>();

    const changeScreen = (screen: string, params?: MessageRequestData) => {
        const targetRoute = navigation
            .getState()
            .routes.find((route: { name: string }) => route.name === screen);
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: screen,
                        params: {
                            ...targetRoute?.params,
                            ...params,
                        },
                    },
                ],
            })
        );
    };

    const handleClickUser = (alias: string) => {
        if (nickname === alias.replace('@', '')) {
            changeScreen('MyIdeasScreen');
        } else {
            changeScreen('ProfileScreen', {
                alias: alias.replace('@', ''),
            });
        }
    };

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
                                onPress={() => handleClickUser(alias)}
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
                                onPress={() => {
                                    navigation.navigate('HashTagScreen', {
                                        hashtag: hashtag_text,
                                    });
                                }}
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
