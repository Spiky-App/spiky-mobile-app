import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { Text, Platform, StyleSheet, View } from 'react-native';
import { styles } from '../../themes/appTheme';
import { Pressable } from 'react-native';
import { faFaceSmile, faPlus } from '../../constants/icons/FontAwesome';
import { emojis1, emojis2 } from '../../constants/emojis/emojis';

interface Props {
    setModalOptions?: (value: boolean) => void;
    handleCreateEmojiReaction: (emoji: string) => void;
    handleCreateX2Reaction: () => void;
    enableX2Reaction: boolean;
    enableEmojiReaction: boolean;
    setEmojiKerboard: (value: boolean) => void;
}

function ReactionButton({
    setModalOptions,
    handleCreateX2Reaction,
    handleCreateEmojiReaction,
    enableX2Reaction,
    enableEmojiReaction,
    setEmojiKerboard,
}: Props) {
    return (
        <View style={stylescomp.containersmall}>
            {enableEmojiReaction && (
                <>
                    <EmojiReaction
                        fixedEmoji={'✅'}
                        handleCreateEmojiReaction={handleCreateEmojiReaction}
                        setModalIdeaOptions={setModalOptions}
                    />
                    <EmojiReaction
                        fixedEmoji={'❌'}
                        handleCreateEmojiReaction={handleCreateEmojiReaction}
                        setModalIdeaOptions={setModalOptions}
                    />
                    <EmojiReaction
                        handleCreateEmojiReaction={handleCreateEmojiReaction}
                        setModalIdeaOptions={setModalOptions}
                        type={1}
                    />
                    <EmojiReaction
                        handleCreateEmojiReaction={handleCreateEmojiReaction}
                        setModalIdeaOptions={setModalOptions}
                    />
                    {!enableX2Reaction && (
                        <EmojiReaction
                            handleCreateEmojiReaction={handleCreateEmojiReaction}
                            setModalIdeaOptions={setModalOptions}
                        />
                    )}
                    <Pressable
                        style={[stylescomp.moreReactions, !enableX2Reaction && { marginRight: 6 }]}
                        onPress={() => setEmojiKerboard(true)}
                    >
                        <View>
                            <FontAwesomeIcon
                                icon={faFaceSmile}
                                color={styles.text_button.color}
                                size={18}
                            />
                            <View style={stylescomp.plusIcon}>
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    color={styles.text_button.color}
                                    size={8}
                                />
                            </View>
                        </View>
                    </Pressable>
                </>
            )}
            {enableX2Reaction && (
                <Pressable
                    style={stylescomp.X2Reaction}
                    onPress={() => {
                        setModalOptions && setModalOptions(false);
                        handleCreateX2Reaction();
                    }}
                >
                    {enableEmojiReaction && enableX2Reaction && <View style={stylescomp.line} />}
                    <Text
                        style={[
                            stylescomp.textX2,
                            !enableEmojiReaction && { color: styles.text.color, width: '100%' },
                        ]}
                    >
                        x2
                    </Text>
                </Pressable>
            )}
        </View>
    );
}

interface EmojiReactionProps {
    fixedEmoji?: string;
    type?: number;
    handleCreateEmojiReaction: (emoji: string) => void;
    setModalIdeaOptions?: (value: boolean) => void;
}
const EmojiReaction = ({
    fixedEmoji,
    type,
    handleCreateEmojiReaction,
    setModalIdeaOptions,
}: EmojiReactionProps) => {
    const [emoji, setEmoji] = useState('');

    useEffect(() => {
        if (fixedEmoji) {
            setEmoji(fixedEmoji);
        } else if (type === 1) {
            setEmoji(emojis1[Math.floor(Math.random() * emojis1.length)]);
        } else {
            setEmoji(emojis2[Math.floor(Math.random() * emojis2.length)]);
        }
    }, []);

    return (
        <Pressable
            onPress={() => {
                setModalIdeaOptions && setModalIdeaOptions(false);
                handleCreateEmojiReaction(emoji);
            }}
            style={stylescomp.emojiContainer}
        >
            <Text style={{ ...styles.text, fontSize: Platform.OS === 'ios' ? 18 : 18 }}>
                {emoji}
            </Text>
        </Pressable>
    );
};

export default ReactionButton;

const stylescomp = StyleSheet.create({
    containersmall: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    moreReactions: {
        ...styles.center,
    },
    X2Reaction: {
        ...styles.center,
        paddingRight: 10,
        flexDirection: 'row',
    },
    emojiContainer: {
        ...styles.center,
    },
    plusIcon: {
        position: 'absolute',
        top: -3,
        right: -6,
    },
    textX2: {
        ...styles.textbold,
        fontSize: 20,
        color: styles.text_button.color,
    },
    line: {
        width: 1.6,
        height: 20,
        opacity: 0.4,
        marginRight: 20,
        backgroundColor: styles.text_button.color,
    },
});
