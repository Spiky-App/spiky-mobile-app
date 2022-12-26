import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { faReply, faXmark } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import { getTime } from '../helpers/getTime';
import { ModalReactComment } from './ModalReactComment';
import { faCheck } from '../constants/icons/FontAwesome';
import IconGray from './svg/IconGray';
import { Comment as CommentProps, ReactionType, User } from '../types/store';
import { useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import MsgTransform from './MsgTransform';
import { FormComment } from './InputComment';
import UniversityTag from './common/UniversityTag';

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
    const [reactComment, setReactComment] = useState({
        against: comment.against,
        favor: comment.favor,
        reactionCommentType: comment.reactionCommentType,
    });
    const [modalReact, setModalReact] = useState(false);
    const [position, setPosition] = useState({ top: 0 });
    const date = getTime(comment.date.toString());
    const { against, favor, reactionCommentType } = reactComment;

    const handleReply = () => {
        const commentMsg = formComment.comment + ' ';
        onChangeComment({
            comment: `${commentMsg}@[@${comment.user.nickname}](${comment.user.id}) `,
        });
        refInputComment.current?.focus();
    };

    useEffect(() => {
        if (position.top !== 0) {
            setModalReact(true);
        }
    }, [position]);

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
                        {reactionCommentType === undefined && (
                            <TouchableOpacity
                                style={{ width: 18, marginLeft: 6 }}
                                onPress={event => {
                                    setPosition({ top: event.nativeEvent.pageY });
                                }}
                            >
                                <IconGray
                                    color="#E6E6E6"
                                    underlayColor={'#01192ebe'}
                                    pressed={modalReact}
                                    style={{
                                        ...styles.shadow_button,
                                        shadowColor: '#484848b9',
                                    }}
                                />
                            </TouchableOpacity>
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

            <View style={{ flexDirection: 'row' }}>
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
            </View>

            <ModalReactComment
                setModalReact={setModalReact}
                modalReact={modalReact}
                position={position}
                commentId={comment.id}
                messageId={comment.messageId}
                userId={comment.user.id ? comment.user.id : 0}
                setReactComment={setReactComment}
            />
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
