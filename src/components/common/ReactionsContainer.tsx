import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { styles } from '../../themes/appTheme';
import { ReactionCount, User } from '../../types/store';
import { ModalShowReactions } from '../ModalShowReactions';

interface Props {
    reactionCount: ReactionCount[];
    myReaction?: string;
    messageId: number;
    handleClickUser: (goToUser: User) => void;
}

function ReactionsContainer({ reactionCount, messageId, handleClickUser }: Props) {
    const [modalReactions, setModalReactions] = useState(false);

    function countReactions() {
        let countOtherReact: number = 0;
        reactionCount.forEach((reaction, index) => {
            if (index > 3) {
                countOtherReact = reaction.count + countOtherReact;
            }
        });
        return countOtherReact;
    }

    return (
        <>
            <Pressable style={stylescomp.wrap} onPress={() => setModalReactions(true)}>
                {reactionCount.map(
                    (reaction, index) =>
                        index < 3 && (
                            <View style={stylescomp.container} key={reaction.reaction}>
                                <Text style={{ fontSize: 11 }}>{reaction.reaction}</Text>
                                <Text
                                    style={{
                                        ...stylescomp.number,
                                    }}
                                >
                                    {reaction.count}
                                </Text>
                            </View>
                        )
                )}
                {reactionCount.length >= 5 && (
                    <View style={stylescomp.moreReaction}>
                        <Text style={{ ...stylescomp.number, fontSize: 10 }}>
                            {`${countReactions()} `}
                        </Text>
                        <Text style={{ ...stylescomp.text, fontSize: 10 }}> Más </Text>
                    </View>
                )}
            </Pressable>
            <ModalShowReactions
                setModalReactions={setModalReactions}
                modalReactions={modalReactions}
                messageId={messageId}
                reactionCount={reactionCount}
                handleClickUser={handleClickUser}
            />
        </>
    );
}

export default ReactionsContainer;

const stylescomp = StyleSheet.create({
    wrap: {
        marginRight: 10,
        flexDirection: 'row',
        ...styles.center,
        borderRadius: 5,
    },
    container: {
        flexDirection: 'row',
        borderRadius: 5,
        paddingHorizontal: 5,
        marginRight: 4,
        paddingVertical: 2,
        backgroundColor: '#D4D4D4',
    },
    number: {
        ...styles.text,
        fontSize: 11,
        // color: 'white',
        color: '#01192e5a',
        marginLeft: 2,
    },
    text: {
        ...styles.text,
        fontSize: 11,
        color: '#01192e5a',
    },
    moreReaction: {
        ...styles.center,
        paddingHorizontal: 2,
        backgroundColor: '#D4D4D4',
        paddingVertical: 3,
        borderRadius: 4,
        flexDirection: 'row',
    },
});