import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { View } from 'react-native';
import { styles } from '../../themes/appTheme';
import { Message, User } from '../../types/store';
import { CommentsButton } from '../common/CommentsButton';
import ReactionsContainers from '../common/ReactionsContainers';
import MsgTransform from '../MsgTransform';
import { PreModalIdeaOptions } from '../PreModalIdeaOptions';
import { faLightbulb, faThumbtack } from '../../constants/icons/FontAwesome';
import { IdeaReaction } from '../IdeaReaction';
import UserComponent from '../common/UserComponent';

interface Props {
    idea: Message;
    filter: string;
    isOwner: boolean;
    spectatorMode: boolean;
    handleClickUser: (goToUser: User) => void;
    handleClickHashtag: (hashtag_text: string) => void;
    handleClickLink: (url: string) => Promise<void>;
    handleOpenIdea: (id: number) => void;
    isOpenedIdeaScreen: boolean;
    setMessageTrackingId?: (value: number | undefined) => void;
    handleCreateEmojiReaction: (emoji: string) => void;
    handleCreateX2Reaction: () => void;
}

export const NormalIdea = ({
    filter,
    idea,
    isOwner,
    spectatorMode,
    handleClickUser,
    handleClickHashtag,
    handleClickLink,
    handleOpenIdea,
    isOpenedIdeaScreen,
    setMessageTrackingId,
    handleCreateEmojiReaction,
    handleCreateX2Reaction,
}: Props) => {
    return (
        <>
            {isOwner && !spectatorMode && (
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
            <UserComponent
                user={idea.user}
                anonymous={idea.anonymous}
                handleClickUser={handleClickUser}
                date={idea.date}
            />
            <View style={{ paddingVertical: 14 }}>
                <MsgTransform
                    textStyle={styles.idea_msg}
                    text={idea.message}
                    handleClickUser={handleClickUser}
                    handleClickHashtag={handleClickHashtag}
                    handleClickLink={handleClickLink}
                />
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
                        handleCreateEmojiReaction={handleCreateEmojiReaction}
                        handleCreateX2Reaction={handleCreateX2Reaction}
                        enableEmojiReaction={!idea.myReaction}
                        enableX2Reaction={!idea.myX2}
                    />
                </View>
            </View>
            {!idea.myX2 && !idea.myReaction && (!isOwner || idea.anonymous) && (
                <IdeaReaction
                    handleCreateX2Reaction={handleCreateX2Reaction}
                    handleCreateEmojiReaction={handleCreateEmojiReaction}
                    enableEmojiReaction={true}
                    enableX2Reaction={!isOwner}
                />
            )}
        </>
    );
};
