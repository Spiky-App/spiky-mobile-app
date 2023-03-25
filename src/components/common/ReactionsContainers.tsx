import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { styles } from '../../themes/appTheme';
import { ReactionCount, User } from '../../types/store';
import { ModalShowReactions } from '../ModalShowReactions';
import { ModalShowX2Reactions } from '../ModalShowX2Reactions';

interface Props {
    reactionCount: ReactionCount[];
    myReaction?: string;
    id: number;
    handleClickUser: (goToUser: User) => void;
    isIdea?: boolean;
    myX2: boolean;
    totalX2: number;
}

function ReactionsContainers({ reactionCount, id, handleClickUser, isIdea, myX2, totalX2 }: Props) {
    const [modalReactions, setModalReactions] = useState(false);
    const [modalX2Reactions, setModalX2Reactions] = useState(false);

    function countReactions() {
        let countOtherReact: number = 0;
        reactionCount.forEach((reaction, index) => {
            if (index >= 3) {
                countOtherReact = reaction.count + countOtherReact;
            }
        });
        return countOtherReact;
    }

    return (
        <>
            {reactionCount.length > 0 && (
                <>
                    <Pressable
                        style={{ ...styles.button_container, paddingHorizontal: 6 }}
                        onPress={() => setModalReactions(true)}
                    >
                        {reactionCount.map(
                            (reaction, index) =>
                                index < 3 && (
                                    <View style={stylescomp.subcontainer} key={reaction.reaction}>
                                        <Text style={{ ...styles.text, fontSize: 12 }}>
                                            {reaction.reaction}
                                        </Text>
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
                        {reactionCount.length >= 4 && (
                            <View style={{ ...stylescomp.subcontainer, ...stylescomp.plusNumber }}>
                                <Text style={{ ...styles.text, color: '#D4D4D4', fontSize: 12 }}>
                                    +
                                </Text>
                                <Text
                                    style={{ ...stylescomp.number, fontSize: 11, color: '#D4D4D4' }}
                                >
                                    {countReactions()}
                                </Text>
                            </View>
                        )}
                    </Pressable>
                    <ModalShowReactions
                        setModalReactions={setModalReactions}
                        modalReactions={modalReactions}
                        id={id}
                        reactionCount={reactionCount}
                        handleClickUser={handleClickUser}
                        isIdea={isIdea}
                    />
                </>
            )}
            {totalX2 > 0 && isIdea && (
                <>
                    <Pressable
                        style={[styles.button_container, myX2 && { backgroundColor: '#67737D' }]}
                        onPress={() => setModalX2Reactions(true)}
                    >
                        <Text style={[stylescomp.x2, myX2 && { color: 'white' }]}>{`X${
                            totalX2 + 1
                        }`}</Text>
                    </Pressable>
                    <ModalShowX2Reactions
                        setModalX2Reactions={setModalX2Reactions}
                        modalX2Reactions={modalX2Reactions}
                        totalX2={totalX2}
                        messageId={id}
                        handleClickUser={handleClickUser}
                    />
                </>
            )}
        </>
    );
}

export default ReactionsContainers;

const stylescomp = StyleSheet.create({
    wrap: {
        marginRight: 10,
        flexDirection: 'row',
        ...styles.center,
    },
    subcontainer: {
        ...styles.center,
        flexDirection: 'row',
        marginHorizontal: 3,
    },
    number: {
        ...styles.text,
        fontSize: 12,
        color: '#67737D',
        marginLeft: 1,
    },
    text: {
        ...styles.text,
        fontSize: 11,
        color: '#67737D',
    },
    plusNumber: {
        backgroundColor: '#67737D',
        borderRadius: 8,
        padding: 2,
        paddingRight: 4,
        marginRight: 0,
    },
    x2: {
        ...styles.textbold,
        fontSize: 14,
        color: '#67737D',
        paddingHorizontal: 4,
    },
});
