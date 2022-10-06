import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { styles } from '../../themes/appTheme';
import { Reaction } from '../../types/store';

interface Props {
    reactions: Reaction[];
    myReaction?: string;
}

function ReactionsContainer({ reactions, myReaction }: Props) {
    return (
        <View style={{ marginRight: 10, flexDirection: 'row', ...styles.center }}>
            {reactions.map(
                (reaction, index) =>
                    index < 5 && (
                        <View
                            style={{
                                ...stylescomp.container,
                                backgroundColor:
                                    myReaction === reaction.reaction ? '#D4D4D4' : 'white',
                            }}
                            key={reaction.reaction}
                        >
                            <Text style={{ fontSize: 11 }}>{reaction.reaction}</Text>
                            <Text
                                style={{
                                    ...stylescomp.number,
                                    color: myReaction === reaction.reaction ? 'white' : '#bebebe',
                                }}
                            >
                                {reaction.count}
                            </Text>
                        </View>
                    )
            )}
            {reactions.length >= 5 && (
                <Pressable style={{ paddingHorizontal: 5 }} onPress={() => {}}>
                    <Text style={{ ...styles.text, ...styles.link }}>Ver más</Text>
                </Pressable>
            )}
        </View>
    );
}

export default ReactionsContainer;

const stylescomp = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 4,
        paddingHorizontal: 4,
        paddingVertical: 3,
    },
    number: {
        ...styles.textbold,
        fontSize: 12,
        color: '#bebebe',
        marginLeft: 2,
    },
    text: {
        ...styles.textbold,
    },
});
