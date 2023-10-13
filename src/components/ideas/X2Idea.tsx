import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../../themes/appTheme';
import { IdeaType, Idea, User } from '../../types/store';
import UniversityTag from '../common/UniversityTag';
import { MoodIdea } from './MoodIdea';
import { NormalIdea } from './NormalIdea';
import { QuoteIdea } from './QuoteIdea';
import { RootStackParamList } from '../../navigator/Navigator';

interface Props {
    idea: Idea;
    filter: string;
    handleClickUser: (goToUser: User) => void;
    handleClickHashtag: (hashtag_text: string) => void;
    handleClickLink: (url: string) => Promise<void>;
    handleOpenIdea: (id: number) => void;
    isOpenedIdeaScreen: boolean;
    setMessageTrackingId?: (value: number | undefined) => void;
    OpenCreateQuoteScreen: () => void;
    handleCreateEmojiReaction: (emoji: string) => void;
    handleCreateX2Reaction: () => void;
    handleGoBack?: () => void;
    openReplyIdeaScreen: (param: RootStackParamList['ReplyIdeaScreen']) => void;
}

export const X2Idea = ({
    filter,
    idea,
    handleClickUser,
    handleClickHashtag,
    handleClickLink,
    handleOpenIdea,
    OpenCreateQuoteScreen,
    handleCreateEmojiReaction,
    handleCreateX2Reaction,
    handleGoBack,
    openReplyIdeaScreen,
}: Props) => {
    const ideaRetrieved =
        idea.type === IdeaType.X2 && idea.childMessage ? { ...idea.childMessage, type: 3 } : idea;
    return (
        <>
            <View style={{ marginBottom: 10 }}>
                <View style={styles.button_user}>
                    <Text style={styles.user_reply}>@{idea.user.nickname}</Text>
                    <UniversityTag id={idea.user.universityId} fontSize={11.8} noColor />
                    <Text style={styles.user_reply}>x2</Text>
                </View>
            </View>
            {idea.childMessage?.type === IdeaType.MOOD && (
                <MoodIdea
                    idea={ideaRetrieved}
                    filter={filter}
                    isOwner={false}
                    handleClickUser={handleClickUser}
                    handleClickHashtag={handleClickHashtag}
                    handleClickLink={handleClickLink}
                    handleOpenIdea={handleOpenIdea}
                    isOpenedIdeaScreen={false}
                    spectatorMode={false}
                    handleCreateEmojiReaction={handleCreateEmojiReaction}
                    handleCreateX2Reaction={handleCreateX2Reaction}
                    OpenCreateQuoteScreen={OpenCreateQuoteScreen}
                    handleGoBack={handleGoBack}
                    openReplyIdeaScreen={openReplyIdeaScreen}
                />
            )}
            {idea.childMessage?.type === IdeaType.NORMAL && (
                <NormalIdea
                    idea={ideaRetrieved}
                    filter={filter}
                    isOwner={false}
                    handleClickUser={handleClickUser}
                    handleClickHashtag={handleClickHashtag}
                    handleClickLink={handleClickLink}
                    handleOpenIdea={handleOpenIdea}
                    isOpenedIdeaScreen={false}
                    spectatorMode={false}
                    OpenCreateQuoteScreen={OpenCreateQuoteScreen}
                    handleCreateEmojiReaction={handleCreateEmojiReaction}
                    handleCreateX2Reaction={handleCreateX2Reaction}
                    handleGoBack={handleGoBack}
                    openReplyIdeaScreen={openReplyIdeaScreen}
                />
            )}
            {idea.childMessage?.type === IdeaType.QUOTE && (
                <QuoteIdea
                    idea={ideaRetrieved}
                    filter={filter}
                    isOwner={false}
                    handleClickUser={handleClickUser}
                    handleClickHashtag={handleClickHashtag}
                    handleClickLink={handleClickLink}
                    handleOpenIdea={handleOpenIdea}
                    isOpenedIdeaScreen={false}
                    spectatorMode={false}
                    handleCreateEmojiReaction={handleCreateEmojiReaction}
                    handleCreateX2Reaction={handleCreateX2Reaction}
                    OpenCreateQuoteScreen={OpenCreateQuoteScreen}
                    handleGoBack={handleGoBack}
                    openReplyIdeaScreen={openReplyIdeaScreen}
                />
            )}
            {idea.childMessage?.type === IdeaType.TOPIC && (
                <NormalIdea
                    idea={ideaRetrieved}
                    filter={filter}
                    isOwner={false}
                    handleClickUser={handleClickUser}
                    handleClickHashtag={handleClickHashtag}
                    handleClickLink={handleClickLink}
                    handleOpenIdea={handleOpenIdea}
                    isOpenedIdeaScreen={false}
                    spectatorMode={false}
                    handleCreateEmojiReaction={handleCreateEmojiReaction}
                    handleCreateX2Reaction={handleCreateX2Reaction}
                    OpenCreateQuoteScreen={OpenCreateQuoteScreen}
                    handleGoBack={handleGoBack}
                    openReplyIdeaScreen={openReplyIdeaScreen}
                />
            )}
        </>
    );
};
