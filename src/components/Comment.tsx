import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { faReply } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import { getTime } from '../helpers/getTime';
import { Comment as CommentProps, User } from '../types/store';
import { useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import MsgTransform from './MsgTransform';
import { FormComment } from './InputComment';
import UniversityTag from './common/UniversityTag';
import ReactionButton from './common/ReactionButton';
import SocketContext from '../context/Socket/Context';
import useSpikyService from '../hooks/useSpikyService';
import ReactionsContainer from './common/ReactionsContainer';

interface Props {
    comment: CommentProps;
    formComment: FormComment;
    onChangeComment: (stateUpdated: Partial<FormComment>) => void;
    refInputComment: React.RefObject<TextInput>;
    handleClickUser: (goToUser: User) => void;
    handleClickHashtag: (hashtag_text: string) => void;
}

export const Comment = ({
    comment,
    formComment,
    onChangeComment,
    refInputComment,
    handleClickUser,
    handleClickHashtag,
}: Props) => {
    const uid = useAppSelector((state: RootState) => state.user.id);
    const { socket } = useContext(SocketContext);
    const { createCommentReaction } = useSpikyService();
    const [reactions, setReactions] = useState(comment.reactions);
    const [myReaction, setMyReaction] = useState(comment.myReaction);
    const date = getTime(comment.date.toString());

    const handleReply = () => {
        const commentMsg = formComment.comment + ' ';
        onChangeComment({
            comment: `${commentMsg}@[@${comment.user.nickname}](${comment.user.id}) `,
        });
        refInputComment.current?.focus();
    };

    const handleReaction = async (reaction: string) => {
        const wasCreated = await createCommentReaction(comment.id, reaction);
        if (wasCreated) {
            socket?.emit('notify', {
                id_usuario1: comment.user.id,
                id_usuario2: uid,
                id_mensaje: comment.messageId,
                tipo: 5,
            });
            let isNew = true;
            let new_reactions = comment.reactions.map(r => {
                if (r.reaction === reaction) {
                    isNew = false;
                    return {
                        reaction: r.reaction,
                        count: r.count + 1,
                    };
                } else {
                    return r;
                }
            });
            if (isNew) {
                new_reactions = [...reactions, { reaction, count: 1 }];
            }
            setReactions(new_reactions);
            setMyReaction(reaction);
        }
    };

    return (
        <View style={stylescom.wrap}>
            <View style={{ ...styles.flex, marginTop: 4 }}>
                <Pressable onPress={() => handleClickUser(comment.user)}>
                    <View style={styles.button_user}>
                        <Text style={styles.user}> @{comment.user.nickname}</Text>
                        <UniversityTag id={comment.user.universityId} fontSize={13} />
                    </View>
                </Pressable>

                <Text style={{ ...styles.numberGray, marginLeft: 10 }}>{date}</Text>
                {uid !== comment.user.id && (
                    <>
                        <TouchableOpacity
                            style={{ ...styles.numberGray, marginLeft: 10 }}
                            onPress={handleReply}
                        >
                            <FontAwesomeIcon
                                icon={faReply}
                                color="#E6E6E6"
                                style={{
                                    ...styles.shadow_button,
                                    shadowColor: '#484848b9',
                                }}
                            />
                        </TouchableOpacity>
                        {myReaction === undefined && (
                            <ReactionButton
                                changeColorOnPress
                                styleCircleButton={{ marginLeft: 10 }}
                                scale={0.5}
                                offsetPosition={{ offset_x: -15, offset_y: -44 }}
                                handleReaction={handleReaction}
                            />
                        )}
                    </>
                )}
            </View>

            <View style={{ marginTop: 4 }}>
                <MsgTransform
                    textStyle={{ ...styles.text, ...styles.msg }}
                    text={comment.comment}
                    handleClickUser={handleClickUser}
                    handleClickHashtag={handleClickHashtag}
                />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
                {reactions.length > 0 && (
                    <ReactionsContainer
                        reactionCount={reactions}
                        id={comment.id}
                        handleClickUser={handleClickUser}
                    />
                )}
            </View>
            {/* <View style={{ flexDirection: 'row' }}>
                <View
                    style={{
                        ...styles.shadow_button,
                        flexDirection: 'row',
                        paddingVertical: 2,
                        borderRadius: 4,
                        backgroundColor: '#D4D4D4',
                        marginTop: 3,
                    }}
                >
                    {against > 0 && (
                        <View
                            style={{
                                flexDirection: 'row',
                                paddingHorizontal: 4,
                                ...styles.center,
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faXmark}
                                color={
                                    reactionCommentType === ReactionType.AGAINST
                                        ? '#01192E'
                                        : 'white'
                                }
                                size={14}
                            />
                            <Text style={{ ...styles.text, ...stylescom.text }}>{against}</Text>
                        </View>
                    )}
                    {favor > 0 && (
                        <View
                            style={{
                                flexDirection: 'row',
                                paddingHorizontal: 4,
                                ...styles.center,
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faCheck}
                                color={
                                    reactionCommentType === ReactionType.FAVOR ? '#01192E' : 'white'
                                }
                                size={14}
                            />
                            <Text style={{ ...styles.text, ...stylescom.text }}>{favor}</Text>
                        </View>
                    )}
                </View>
            </View> */}
        </View>
    );
};

const stylescom = StyleSheet.create({
    wrap: {
        marginVertical: 8,
    },
    text: {
        color: '#01192e5a',
        fontSize: 12,
        marginLeft: 2,
    },
});
