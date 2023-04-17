import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { styles } from '../themes/appTheme';
import { User, IdeaType } from '../types/store';
import { ModalIdeaOptions } from './ModalIdeaOptions';

interface Props {
    myIdea: boolean;
    message: {
        ideaId: number;
        message: string;
        user: User;
        date: number;
        messageTrackingId?: number;
        ideaType: IdeaType;
        anonymous: boolean;
    };
    setMessageTrackingId?: (value: number | undefined) => void;
    filter?: string;
    isOpenedIdeaScreen?: boolean;
    handleCreateEmojiReaction?: (emoji: string) => void;
    handleCreateX2Reaction?: () => void;
    enableX2Reaction: boolean;
    enableEmojiReaction: boolean;
}

export const PreModalIdeaOptions = ({
    myIdea,
    message,
    filter,
    isOpenedIdeaScreen,
    setMessageTrackingId,
    handleCreateEmojiReaction,
    handleCreateX2Reaction,
    enableX2Reaction,
    enableEmojiReaction,
}: Props) => {
    const [modalIdeaOptions, setModalIdeaOptions] = useState(false);

    return (
        <>
            <View style={{ position: 'relative' }}>
                <Pressable onPress={() => setModalIdeaOptions(true)}>
                    <Text style={stylescom.dots}>...</Text>
                </Pressable>
            </View>
            <ModalIdeaOptions
                setModalIdeaOptions={setModalIdeaOptions}
                modalIdeaOptions={modalIdeaOptions}
                myIdea={myIdea}
                message={message}
                filter={filter}
                isOpenedIdeaScreen={isOpenedIdeaScreen}
                setMessageTrackingId={setMessageTrackingId}
                ideaType={message.ideaType}
                handleCreateEmojiReaction={handleCreateEmojiReaction}
                handleCreateX2Reaction={handleCreateX2Reaction}
                enableEmojiReaction={enableEmojiReaction}
                enableX2Reaction={enableX2Reaction}
            />
        </>
    );
};

const stylescom = StyleSheet.create({
    dots: {
        ...styles.textbold,
        color: styles.text_button.color,
        fontSize: 28,
        paddingLeft: 5,
        top: -1,
        right: -4,
    },
});
