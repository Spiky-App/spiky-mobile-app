import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MentionSuggestionsProps, Suggestion } from 'react-native-controlled-mentions';
import SpikyService from '../services/SpikyService';
import { RootState } from '../store';
import { useAppSelector } from '../store/hooks';
import { styles } from '../themes/appTheme';

interface RenderSuggestionsProps extends MentionSuggestionsProps {
    isMention: boolean;
}

export const renderSuggetions: FC<RenderSuggestionsProps> = ({
    keyword,
    onSuggestionPress,
    isMention,
}) => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const service = new SpikyService(config);

    const getUserSuggestions = async (word: string | undefined) => {
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

    const getHashtagSuggestions = async (word: string | undefined) => {
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
        <View style={stylecom.containermention}>
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
