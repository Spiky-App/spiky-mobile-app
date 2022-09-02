import React, { FC, useEffect, useState } from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { MentionSuggestionsProps, Suggestion } from 'react-native-controlled-mentions';
import SpikyService from '../services/SpikyService';
import { RootState } from '../store';
import { useAppSelector } from '../store/hooks';
import { styles } from '../themes/appTheme';
import { Dimensions } from 'react-native';

interface RenderSuggestionsProps extends MentionSuggestionsProps {
    isMention: boolean;
    inputHeight?: number;
}

export const renderSuggetions: FC<RenderSuggestionsProps> = ({
    keyword,
    onSuggestionPress,
    isMention,
    inputHeight,
}) => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const service = new SpikyService(config);

    const InputStyles: StyleProp<ViewStyle> = inputHeight
        ? {
              ...stylecom.containermention,
              width: Dimensions.get('window').width - 40,
              position: 'absolute',
              left: -10,
              bottom: inputHeight - 30,
          }
        : stylecom.containermention;

    const getUserSuggestions = async (word: string) => {
        if (word !== '@') {
            if (word !== '') {
                const response = await service.getUserSuggestions(word);
                const { data } = response;
                const { usuarios } = data;
                setSuggestions(
                    usuarios.map((user: any) => ({ name: '@' + user.alias, id: user.id_usuario }))
                );
            } else {
                setSuggestions([]);
            }
        }
    };

    const getHashtagSuggestions = async (word: string) => {
        if (word === '') word = 'anyhashtag0320';
        if (word !== '#') {
            const response = await service.getHashtagsSuggestions(word);
            const { data } = response;
            const { hashtags } = data;
            const newHashtags =
                word === 'anyhashtag0320'
                    ? hashtags
                    : [{ hashtag: word, id_hashtag: 0 }, ...hashtags];
            setSuggestions(
                newHashtags.map((hash: any) => ({ name: '#' + hash.hashtag, id: hash.id_hashtag }))
            );
        }
    };

    useEffect(() => {
        if (keyword !== undefined) {
            if (isMention) {
                getUserSuggestions(keyword);
            } else {
                getHashtagSuggestions(keyword);
            }
        }
    }, [keyword]);

    if (keyword === undefined || suggestions.length === 0) return null;

    return (
        <View style={InputStyles}>
            {suggestions.map(one => (
                <TouchableOpacity
                    key={one.id}
                    onPress={() => onSuggestionPress(one)}
                    style={{ marginVertical: 7, marginLeft: 10 }}
                >
                    <Text style={stylecom.textmention}>{one.name}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const stylecom = StyleSheet.create({
    containermention: {
        backgroundColor: '#01192E',
        borderRadius: 5,
        marginVertical: 5,
        paddingVertical: 3,
    },
    textmention: {
        ...styles.h5,
        fontSize: 16,
        color: '#ffff',
    },
});
