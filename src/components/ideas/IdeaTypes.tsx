import React from 'react';
import { Idea, IdeaType, User, TopicQuestion } from '../../types/store';
import { NormalIdea } from './../ideas/NormalIdea';
import { DraftIdea } from './../ideas/DraftIdea';
import { PollIdea } from './../ideas/PollIdea';
import { X2Idea } from './../ideas/X2Idea';
import { MoodIdea } from './../ideas/MoodIdea';
import { QuoteIdea } from './QuoteIdea';
import { View } from 'react-native';
import { styles } from '../../themes/appTheme';
import { TopicIdea } from './TopicIdea';
import { RootStackParamList } from '../../navigator/Navigator';

interface IdeaTypesProp {
    idea: Idea;
    filter: string;
    isOwner: boolean;
    spectatorMode: boolean;
    handleClickUser: (goToUser: User) => void;
    handleClickHashtag: (hashtag_text: string) => void;
    handleClickLink: (url: string) => Promise<void>;
    handleOpenIdea: (id: number) => void;
    handleDelete?: (id: number) => Promise<void>;
    isOpenedIdeaScreen: boolean;
    setMessageTrackingId?: (value: number | undefined) => void;
    handleCreateEmojiReaction: (emoji: string) => void;
    handleCreateX2Reaction: () => void;
    OpenCreateQuoteScreen: () => void;
    handleClicTopicQuestion: (topicQuestion: TopicQuestion | undefined) => void;
    handleGoBack?: () => void;
    openReplyIdeaScreen: (param: RootStackParamList['ReplyIdeaScreen']) => void;
}

export const IdeaTypes = ({
    filter,
    idea,
    isOwner,
    spectatorMode,
    handleClickUser,
    handleClickHashtag,
    handleClickLink,
    handleOpenIdea,
    handleDelete,
    isOpenedIdeaScreen,
    setMessageTrackingId,
    handleCreateEmojiReaction,
    handleCreateX2Reaction,
    OpenCreateQuoteScreen,
    handleClicTopicQuestion,
    handleGoBack,
    openReplyIdeaScreen,
}: IdeaTypesProp) => {
    switch (idea.type) {
        case IdeaType.NORMAL:
            return (
                <View style={styles.white_idea_wrap}>
                    <View style={[styles.idea_subwrap, handleGoBack && { paddingLeft: 32 }]}>
                        <NormalIdea
                            idea={idea}
                            filter={filter}
                            isOwner={isOwner}
                            handleClickUser={handleClickUser}
                            handleClickHashtag={handleClickHashtag}
                            handleClickLink={handleClickLink}
                            handleOpenIdea={handleOpenIdea}
                            isOpenedIdeaScreen={isOpenedIdeaScreen}
                            spectatorMode={spectatorMode}
                            handleCreateEmojiReaction={handleCreateEmojiReaction}
                            handleCreateX2Reaction={handleCreateX2Reaction}
                            OpenCreateQuoteScreen={OpenCreateQuoteScreen}
                            handleGoBack={handleGoBack}
                            openReplyIdeaScreen={openReplyIdeaScreen}
                        />
                    </View>
                </View>
            );
        case IdeaType.DRAFT:
            return (
                <View style={styles.white_idea_wrap}>
                    <View style={styles.idea_subwrap}>
                        <DraftIdea
                            idea={idea}
                            handleClickUser={handleClickUser}
                            handleClickHashtag={handleClickHashtag}
                            handleClickLink={handleClickLink}
                            handleDelete={handleDelete}
                        />
                    </View>
                </View>
            );
        case IdeaType.POLL:
            return (
                <View style={styles.white_idea_wrap}>
                    <View style={[styles.idea_subwrap, handleGoBack && { paddingLeft: 32 }]}>
                        <PollIdea
                            idea={idea}
                            filter={filter}
                            isOwner={isOwner}
                            handleClickUser={handleClickUser}
                            handleClickHashtag={handleClickHashtag}
                            handleClickLink={handleClickLink}
                            handleOpenIdea={handleOpenIdea}
                            isOpenedIdeaScreen={isOpenedIdeaScreen}
                            spectatorMode={spectatorMode}
                            handleGoBack={handleGoBack}
                            openReplyIdeaScreen={openReplyIdeaScreen}
                        />
                    </View>
                </View>
            );
        case IdeaType.X2:
            return (
                <View style={styles.white_idea_wrap}>
                    <View style={[styles.idea_subwrap, handleGoBack && { paddingLeft: 32 }]}>
                        <X2Idea
                            idea={idea}
                            filter={filter}
                            handleClickUser={handleClickUser}
                            handleClickHashtag={handleClickHashtag}
                            handleClickLink={handleClickLink}
                            handleOpenIdea={handleOpenIdea}
                            isOpenedIdeaScreen={isOpenedIdeaScreen}
                            setMessageTrackingId={setMessageTrackingId}
                            handleCreateEmojiReaction={handleCreateEmojiReaction}
                            handleCreateX2Reaction={handleCreateX2Reaction}
                            OpenCreateQuoteScreen={OpenCreateQuoteScreen}
                            handleGoBack={handleGoBack}
                            openReplyIdeaScreen={openReplyIdeaScreen}
                        />
                    </View>
                </View>
            );
        case IdeaType.QUOTE:
            return (
                <View style={styles.white_idea_wrap}>
                    <View style={[styles.idea_subwrap, handleGoBack && { paddingLeft: 32 }]}>
                        <QuoteIdea
                            idea={idea}
                            filter={filter}
                            isOwner={isOwner}
                            handleClickUser={handleClickUser}
                            handleClickHashtag={handleClickHashtag}
                            handleClickLink={handleClickLink}
                            handleOpenIdea={handleOpenIdea}
                            isOpenedIdeaScreen={isOpenedIdeaScreen}
                            spectatorMode={spectatorMode}
                            handleCreateEmojiReaction={handleCreateEmojiReaction}
                            handleCreateX2Reaction={handleCreateX2Reaction}
                            OpenCreateQuoteScreen={OpenCreateQuoteScreen}
                            handleGoBack={handleGoBack}
                            openReplyIdeaScreen={openReplyIdeaScreen}
                        />
                    </View>
                </View>
            );
        case IdeaType.MOOD:
            return (
                <View style={styles.white_idea_wrap}>
                    <View style={[styles.idea_subwrap, handleGoBack && { paddingLeft: 32 }]}>
                        <MoodIdea
                            idea={idea}
                            filter={filter}
                            isOwner={isOwner}
                            handleClickUser={handleClickUser}
                            handleClickHashtag={handleClickHashtag}
                            handleClickLink={handleClickLink}
                            handleOpenIdea={handleOpenIdea}
                            isOpenedIdeaScreen={isOpenedIdeaScreen}
                            spectatorMode={spectatorMode}
                            handleCreateEmojiReaction={handleCreateEmojiReaction}
                            handleCreateX2Reaction={handleCreateX2Reaction}
                            OpenCreateQuoteScreen={OpenCreateQuoteScreen}
                            handleGoBack={handleGoBack}
                            openReplyIdeaScreen={openReplyIdeaScreen}
                        />
                    </View>
                </View>
            );
        case IdeaType.TOPIC:
            return (
                <TopicIdea
                    idea={idea}
                    filter={filter}
                    isOwner={isOwner}
                    handleClickUser={handleClickUser}
                    handleClickHashtag={handleClickHashtag}
                    handleClickLink={handleClickLink}
                    handleOpenIdea={handleOpenIdea}
                    isOpenedIdeaScreen={isOpenedIdeaScreen}
                    spectatorMode={spectatorMode}
                    handleCreateEmojiReaction={handleCreateEmojiReaction}
                    handleCreateX2Reaction={handleCreateX2Reaction}
                    OpenCreateQuoteScreen={OpenCreateQuoteScreen}
                    handleClicTopicQuestion={handleClicTopicQuestion}
                    handleGoBack={handleGoBack}
                    openReplyIdeaScreen={openReplyIdeaScreen}
                />
            );
        default:
            return <></>;
    }
};
