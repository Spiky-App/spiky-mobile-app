import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../../themes/appTheme';
import { IdeaType, Message, User } from '../../types/store';
import UniversityTag from '../common/UniversityTag';
import { MoodIdea } from './MoodIdea';
import { NormalIdea } from './NormalIdea';

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

export const X2Idea = ({
    filter,
    idea,
    isOwner,
    handleClickUser,
    handleClickHashtag,
    handleClickLink,
    handleOpenIdea,
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
                    isOwner={isOwner}
                    handleClickUser={handleClickUser}
                    handleClickHashtag={handleClickHashtag}
                    handleClickLink={handleClickLink}
                    handleOpenIdea={handleOpenIdea}
                    isOpenedIdeaScreen={false}
                />
            )}
            {idea.childMessage?.type === IdeaType.NORMAL && (
                <NormalIdea
                    idea={ideaRetrieved}
                    filter={filter}
                    isOwner={isOwner}
                    handleClickUser={handleClickUser}
                    handleClickHashtag={handleClickHashtag}
                    handleClickLink={handleClickLink}
                    handleOpenIdea={handleOpenIdea}
                    isOpenedIdeaScreen={false}
                />
            )}
        </>
    );
};
