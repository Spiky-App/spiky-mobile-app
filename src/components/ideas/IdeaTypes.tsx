import React from 'react';
import { Message, IdeaType, User, TopicQuestion } from '../../types/store';
import { NormalIdea } from './../ideas/NormalIdea';
import { DraftIdea } from './../ideas/DraftIdea';
import { PollIdea } from './../ideas/PollIdea';
import { X2Idea } from './../ideas/X2Idea';
import { MoodIdea } from './../ideas/MoodIdea';
import { QuoteIdea } from './QuoteIdea';
import { Text, View } from 'react-native';
import { styles } from '../../themes/appTheme';
import { TopicIdea } from './TopicIdea';

interface IdeaTypesProp {
    idea: Message;
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
}: IdeaTypesProp) => {
    switch (idea.type) {
        case IdeaType.NORMAL:
            return (
                <View style={styles.white_idea_wrap}>
                    <View style={styles.idea_subwrap}>
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
                    <View style={styles.idea_subwrap}>
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
                        />
                    </View>
                </View>
            );
        case IdeaType.X2:
            return (
                <View style={styles.white_idea_wrap}>
                    <View style={styles.idea_subwrap}>
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
                        />
                    </View>
                </View>
            );
        case IdeaType.QUOTE:
            return (
                <View style={styles.white_idea_wrap}>
                    <View style={styles.idea_subwrap}>
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
                        />
                    </View>
                </View>
            );
        case IdeaType.MOOD:
            return (
                <View style={styles.white_idea_wrap}>
                    <View style={styles.idea_subwrap}>
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
                />
            );
        default:
            return (
                <View style={{ ...styles.center, paddingBottom: 10 }}>
                    <Text style={styles.link}>
                        Actualiza la aplicación para ver esta publicación.
                    </Text>
                </View>
            );
    }
};
