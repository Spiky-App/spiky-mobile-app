import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { View, Pressable } from 'react-native';
import { styles } from '../../themes/appTheme';
import { Message, User } from '../../types/store';
import MsgTransform from '../MsgTransform';
import { faLightbulb, faThumbtack } from '../../constants/icons/FontAwesome';
import { Poll } from '../Poll';
import { PreModalIdeaOptions } from '../PreModalIdeaOptions';
import UserComponent from '../common/UserComponent';
import { addToast } from '../../store/feature/toast/toastSlice';
import { useAppDispatch } from '../../store/hooks';
import { StatusType } from '../../types/common';

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
}

export const PollIdea = ({
    idea,
    filter,
    isOwner,
    spectatorMode,
    handleClickUser,
    handleClickHashtag,
    handleClickLink,
    handleOpenIdea,
    isOpenedIdeaScreen,
    setMessageTrackingId,
}: Props) => {
    const dispatch = useAppDispatch();
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
                <Poll
                    answers={idea.answers}
                    totalAnswers={idea.totalAnswers}
                    myAnswers={idea.myAnswers}
                    messageId={idea.id}
                    userIdMessageOwner={idea.user.id ? idea.user.id : 0}
                    isAnonymous={idea.anonymous}
                    totalComments={idea.totalComments}
                    handleClickUser={handleClickUser}
                    handleOpenIdea={() => handleOpenIdea(idea.id)}
                    isOpenedIdeaScreen={isOpenedIdeaScreen}
                />
                {(idea.myAnswers || (isOwner && !idea.anonymous)) && (
                    <View style={[styles.container_abs, styles.flex_container]}>
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
                            enableEmojiReaction={false}
                            enableX2Reaction={false}
                        />
                    </View>
                )}
            </View>
            {!idea.myAnswers && (!isOwner || idea.anonymous) && (
                <Pressable
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: 32,
                        bottom: 6,
                        backgroundColor: 'white',
                        opacity: 0.7,
                    }}
                    onPress={() => {
                        dispatch(
                            addToast({
                                message: 'Primero tendrás que participar.',
                                type: StatusType.INFORMATION,
                            })
                        );
                    }}
                />
            )}
        </>
    );
};
