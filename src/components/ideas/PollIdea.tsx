import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Pressable, Text, View } from 'react-native';
import { getTime } from '../../helpers/getTime';
import { styles } from '../../themes/appTheme';
import { Message, User } from '../../types/store';
import UniversityTag from '../common/UniversityTag';
import MsgTransform from '../MsgTransform';
import { faLightbulb, faThumbtack } from '../../constants/icons/FontAwesome';
import { Poll } from '../Poll';
import { PreModalIdeaOptions } from '../PreModalIdeaOptions';

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
    const fecha = getTime(idea.date.toString());
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
            {idea.anonymous ? (
                <View style={styles.button_user}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.user}>@_______</Text>
                    </View>
                </View>
            ) : (
                <Pressable
                    onPress={() => handleClickUser(idea.user)}
                    style={{ alignSelf: 'flex-start' }}
                >
                    <View style={styles.button_user}>
                        <Text style={styles.user}>@{idea.user.nickname}</Text>
                        <UniversityTag id={idea.user.universityId} fontSize={14} />
                    </View>
                </Pressable>
            )}
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
                {idea.myAnswers && (
                    <View style={[styles.container_abs, styles.flex_container]}>
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
                )}
            </View>
        </>
    );
};
