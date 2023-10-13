import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Pressable, StyleSheet, View } from 'react-native';
import { styles } from '../../themes/appTheme';
import { Idea, TopicQuestion, User } from '../../types/store';
import { CommentsButton } from '../common/CommentsButton';
import ReactionsContainers from '../common/ReactionsContainers';
import MsgTransform from '../MsgTransform';
import { PreModalIdeaOptions } from '../PreModalIdeaOptions';
import { faChevronLeft, faLightbulb, faThumbtack } from '../../constants/icons/FontAwesome';
import { IdeaReaction } from '../IdeaReaction';
import UserComponent from '../common/UserComponent';
import { Text } from 'react-native';
import { RootStackParamList } from '../../navigator/Navigator';
import { ReplyIdeaButton } from '../common/ReplyIdeaButton';

interface Props {
    idea: Idea;
    filter: string;
    isOwner: boolean;
    spectatorMode: boolean;
    handleClickUser: (goToUser: User) => void;
    handleClickHashtag: (hashtag_text: string) => void;
    handleClickLink: (url: string) => Promise<void>;
    handleOpenIdea: (id: number) => void;
    isOpenedIdeaScreen: boolean;
    setMessageTrackingId?: (value: number | undefined) => void;
    handleCreateEmojiReaction?: (emoji: string) => void;
    handleCreateX2Reaction?: () => void;
    OpenCreateQuoteScreen: () => void;
    handleClicTopicQuestion: (topicQuestion: TopicQuestion | undefined) => void;
    handleGoBack?: () => void;
    openReplyIdeaScreen: (param: RootStackParamList['ReplyIdeaScreen']) => void;
}

export const TopicIdea = ({
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
    OpenCreateQuoteScreen,
    handleClicTopicQuestion,
    handleGoBack,
    openReplyIdeaScreen,
}: Props) => {
    const backgroundColor = idea.topicQuestion?.topic.backgroundColor;
    return (
        <View style={[stylescomp.main_wrap, { backgroundColor }]}>
            {idea.topicQuestion && (
                <Pressable
                    style={stylescomp.topic}
                    onPress={() => handleClicTopicQuestion(idea.topicQuestion)}
                >
                    <View style={stylescomp.emoji_container}>
                        <Text style={styles.h6}>{idea.topicQuestion?.topic.emoji}</Text>
                    </View>
                    <Text style={styles.idea_msg}>{idea.topicQuestion?.question}</Text>
                </Pressable>
            )}
            <View style={stylescomp.white_idea_wrap}>
                <View style={[styles.idea_subwrap, handleGoBack && { paddingLeft: 32 }]}>
                    {handleGoBack && (
                        <Pressable style={styles.arrow_back} onPress={handleGoBack}>
                            <FontAwesomeIcon icon={faChevronLeft} color={'#D4D4D4'} size={25} />
                        </Pressable>
                    )}
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
                                callback={
                                    !isOpenedIdeaScreen ? () => handleOpenIdea(idea.id) : undefined
                                }
                                totalComments={idea.totalComments}
                            />
                            <ReplyIdeaButton
                                idea={idea}
                                isOwner={isOwner}
                                isOpenedIdeaScreen={isOpenedIdeaScreen}
                                openReplyIdeaScreen={openReplyIdeaScreen}
                            />
                        </View>
                        <View style={styles.flex_container}>
                            <PreModalIdeaOptions
                                myIdea={isOwner}
                                message={{
                                    id: idea.id,
                                    message: idea.message,
                                    user: idea.user,
                                    messageTrackingId: idea.messageTrackingId,
                                    date: idea.date,
                                    type: idea.type,
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
                            OpenCreateQuoteScreen={OpenCreateQuoteScreen}
                        />
                    )}
                </View>
            </View>
        </View>
    );
};

const stylescomp = StyleSheet.create({
    main_wrap: {
        width: '92%',
        marginVertical: 8,
        borderRadius: 14,
    },
    white_idea_wrap: {
        backgroundColor: 'white',
        borderRadius: 14,
        shadowColor: '#4d4d4d',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 6,
        width: '100%',
    },
    wrap_topic: {
        ...styles.shadow,
        flex: 1,
        borderRadius: 14,
        width: '100%',
    },
    topic: {
        ...styles.flex_start,
        width: '100%',
        paddingHorizontal: 15,
        paddingVertical: 15,
        alignSelf: 'flex-start',
    },
    emoji_container: {
        ...styles.flex_center,
        backgroundColor: '#ffff',
        borderRadius: 15,
        height: 35,
        width: 35,
        marginRight: 10,
    },
});
