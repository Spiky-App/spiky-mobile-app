import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Pressable, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { faPlus, faReply } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import { Comment as CommentProps, User } from '../types/store';
import { useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import MsgTransform from './MsgTransform';
import { FormComment } from './InputComment';
import SocketContext from '../context/Socket/Context';
import useSpikyService from '../hooks/useSpikyService';
import ReactionsContainer from './common/ReactionsContainers';
import { ModalCommentOptions } from './ModalCommentOptions';
import UserComponent from './common/UserComponent';

interface Props {
    comment: CommentProps;
    formComment: FormComment;
    onChangeComment: (stateUpdated: Partial<FormComment>) => void;
    refInputComment: React.RefObject<TextInput>;
    handleClickUser: (goToUser: User) => void;
    handleClickHashtag: (hashtag_text: string) => void;
    handleClickLink: (url: string) => Promise<void>;
}

export const Comment = ({
    comment,
    formComment,
    onChangeComment,
    refInputComment,
    handleClickUser,
    handleClickHashtag,
    handleClickLink,
}: Props) => {
    const uid = useAppSelector((state: RootState) => state.user.id);
    const { socket } = useContext(SocketContext);
    const { createCommentReaction } = useSpikyService();
    const [reactions, setReactions] = useState(comment.reactions);
    const [myReaction, setMyReaction] = useState(comment.myReaction);
    const [modalCommentOptions, setModalCommentOptions] = useState(false);

    const handleReply = () => {
        const commentMsg = formComment.comment + ' ';
        onChangeComment({
            comment: `${commentMsg}@[@${comment.user.nickname}](${comment.user.id}) `,
        });
        refInputComment.current?.focus();
    };

    const handleCreateEmojiReactionComment = async (reaction: string) => {
        const wasCreated = await createCommentReaction(comment.id, reaction);
        if (wasCreated) {
            socket?.emit('notify', {
                id_usuario1: comment.user.id,
                id_usuario2: uid,
                id_mensaje: comment.messageId,
                id_respuesta: comment.id,
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
                <UserComponent
                    handleClickUser={handleClickUser}
                    user={comment.user}
                    date={comment.date}
                    anonymous={false}
                />
                {uid !== comment.user.id && (
                    <>
                        <TouchableOpacity
                            style={{ ...styles.numberGray, marginLeft: 10 }}
                            onPress={handleReply}
                        >
                            <FontAwesomeIcon
                                icon={faReply}
                                color="#D4D4D4"
                                style={{
                                    shadowOffset: {
                                        width: 1,
                                        height: 2,
                                    },
                                }}
                            />
                        </TouchableOpacity>
                        {myReaction === undefined && (
                            <>
                                <Pressable
                                    style={stylescom.actions}
                                    onPress={() => setModalCommentOptions(true)}
                                >
                                    <FontAwesomeIcon icon={faPlus} color="white" size={12} />
                                </Pressable>
                                <ModalCommentOptions
                                    setModalCommentOptions={setModalCommentOptions}
                                    modalCommentOptions={modalCommentOptions}
                                    handleCreateEmojiReactionComment={
                                        handleCreateEmojiReactionComment
                                    }
                                />
                            </>
                        )}
                    </>
                )}
            </View>

            <View style={{ marginTop: 8, marginVertical: 8, flexShrink: 1 }}>
                <MsgTransform
                    textStyle={{ ...styles.idea_msg }}
                    text={comment.comment}
                    handleClickUser={handleClickUser}
                    handleClickHashtag={handleClickHashtag}
                    handleClickLink={handleClickLink}
                />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
                {reactions.length > 0 && (
                    <ReactionsContainer
                        reactionCount={reactions}
                        id={comment.id}
                        handleClickUser={handleClickUser}
                        totalX2={0}
                        myX2={false}
                    />
                )}
            </View>
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
    actions: {
        ...styles.center,
        borderRadius: 14,
        backgroundColor: '#D4D4D4',
        height: 18,
        minWidth: 18,
        marginLeft: 15,
    },
});
