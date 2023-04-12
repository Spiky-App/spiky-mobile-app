import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getTime } from '../../helpers/getTime';
import { styles } from '../../themes/appTheme';
import { Message, User } from '../../types/store';
import { CommentsButton } from '../common/CommentsButton';
import ReactionsContainers from '../common/ReactionsContainers';
import UniversityTag from '../common/UniversityTag';
import MsgTransform from '../MsgTransform';
import { PreModalIdeaOptions } from '../PreModalIdeaOptions';
import { faLightbulb, faThumbtack } from '../../constants/icons/FontAwesome';
import { IdeaReaction } from '../IdeaReaction';

interface Props {
    idea: Message;
    filter: string;
    isOwner: boolean;
    handleClickUser: (goToUser: User) => void;
    handleClickHashtag: (hashtag_text: string) => void;
    handleClickLink: (url: string) => Promise<void>;
    handleOpenIdea: (id: number) => void;
    isOpenedIdeaScreen: boolean;
    setMessageTrackingId?: (value: number | undefined) => void;
}

export const MoodIdea = ({
    filter,
    idea,
    isOwner,
    handleClickUser,
    handleClickHashtag,
    handleClickLink,
    handleOpenIdea,
    isOpenedIdeaScreen,
    setMessageTrackingId,
}: Props) => {
    const fecha = getTime(idea.date.toString());
    return (
        <>
            {isOwner && (
                <View style={styles.corner_container}>
                    <View style={styles.corner}>
                        <View style={{ transform: [{ rotate: '-45deg' }] }}>
                            <FontAwesomeIcon icon={faLightbulb} color="white" size={13} />
                        </View>
                    </View>
                </View>
            )}
            {idea.messageTrackingId && (
                <View style={styles.corner_container}>
                    <View style={{ ...styles.corner, backgroundColor: '#FC702A' }}>
                        <View>
                            <FontAwesomeIcon icon={faThumbtack} color="white" size={13} />
                        </View>
                    </View>
                </View>
            )}

            <View style={{ ...styles.flex_center, justifyContent: 'flex-start' }}>
                <View style={{ marginRight: 12 }}>
                    <View style={stylescom.mood_label}>
                        <Text style={{ ...styles.text_button, fontSize: 10 }}>Estado</Text>
                    </View>
                    <Text style={{ fontSize: 38 }}>
                        {idea.message.substring(0, idea.message.indexOf('|'))}
                    </Text>
                </View>
                <View style={{ flexShrink: 1, alignSelf: 'flex-start' }}>
                    <Pressable
                        onPress={() => handleClickUser(idea.user)}
                        style={{ alignSelf: 'flex-start' }}
                    >
                        <View style={styles.button_user}>
                            <Text style={styles.user}>@{idea.user.nickname}</Text>
                            <UniversityTag id={idea.user.universityId} fontSize={14} />
                        </View>
                    </Pressable>

                    <View style={{ paddingVertical: 14 }}>
                        <MsgTransform
                            textStyle={styles.idea_msg}
                            text={idea.message.substring(idea.message.indexOf('|') + 1)}
                            handleClickUser={handleClickUser}
                            handleClickHashtag={handleClickHashtag}
                            handleClickLink={handleClickLink}
                        />
                    </View>
                </View>
            </View>

            <View
                style={{
                    ...styles.flex_container,
                    justifyContent: 'space-between',
                }}
            >
                <View style={styles.flex_container}>
                    <ReactionsContainers
                        reactionCount={idea.reactions}
                        myReaction={idea.myReaction}
                        id={idea.id}
                        handleClickUser={handleClickUser}
                        isIdea
                        totalX2={idea.totalX2}
                        myX2={idea.myX2}
                    />
                    <CommentsButton
                        callback={!isOpenedIdeaScreen ? () => handleOpenIdea(idea.id) : undefined}
                        totalComments={idea.totalComments}
                    />
                </View>
                <View style={styles.flex_container}>
                    <Text style={styles.number}>{fecha}</Text>
                    <PreModalIdeaOptions
                        myIdea={isOwner}
                        message={{
                            ideaId: idea.id,
                            message: idea.message,
                            user: idea.user,
                            messageTrackingId: idea.messageTrackingId,
                            date: idea.date,
                            ideaType: idea.type,
                            anonymous: idea.anonymous,
                        }}
                        filter={filter}
                        isOpenedIdeaScreen={isOpenedIdeaScreen}
                        setMessageTrackingId={setMessageTrackingId}
                    />
                </View>
            </View>
            {!idea.myX2 && !idea.myReaction && (!isOwner || idea.anonymous) && (
                <IdeaReaction messageId={idea.id} isOwnerAndAnonymous={isOwner && idea.anonymous} />
            )}
        </>
    );
};

const stylescom = StyleSheet.create({
    mood_label: {
        ...styles.flex_center,
        backgroundColor: '#E8E8E8',
        borderRadius: 3,
        padding: 2,
    },
});
