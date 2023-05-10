import React from 'react';
import { Message, IdeaType, User } from '../../types/store';
import { NormalIdea } from './../ideas/NormalIdea';
import { DraftIdea } from './../ideas/DraftIdea';
import { PollIdea } from './../ideas/PollIdea';
import { X2Idea } from './../ideas/X2Idea';
import { MoodIdea } from './../ideas/MoodIdea';

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
}: IdeaTypesProp) => {
    switch (idea.type) {
        case IdeaType.NORMAL:
            return (
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
                />
            );
        case IdeaType.DRAFT:
            return (
                <DraftIdea
                    idea={idea}
                    handleClickUser={handleClickUser}
                    handleClickHashtag={handleClickHashtag}
                    handleClickLink={handleClickLink}
                    handleDelete={handleDelete}
                />
            );
        case IdeaType.POLL:
            return (
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
                />
            );
        case IdeaType.X2:
            return (
                <X2Idea
                    idea={idea}
                    filter={filter}
                    handleClickUser={handleClickUser}
                    handleClickHashtag={handleClickHashtag}
                    handleClickLink={handleClickLink}
                    handleOpenIdea={handleOpenIdea}
                    isOpenedIdeaScreen={isOpenedIdeaScreen}
                    setMessageTrackingId={setMessageTrackingId}
                />
            );
        case IdeaType.MOOD:
            return (
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
                />
            );
        default:
            return <></>;
    }
};
