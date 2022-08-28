import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { faReply, faXmark } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import { getTime } from '../helpers/getTime';
import { ModalReactComment } from './ModalReactComment';
import { faCheck } from '../constants/icons/FontAwesome';
import IconGray from './svg/IconGray';
import { Comment as CommentProps, ReactionType } from '../types/store';
import { useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import MsgTransform from './MsgTransform';

interface Props {
    comment: CommentProps;
}

export const Comment = ({ comment }: Props) => {
    const uid = useAppSelector((state: RootState) => state.user.id);
    const [reactComment, setReactComment] = useState({
        against: comment.against,
        favor: comment.favor,
        reactionCommentType: comment.reactionCommentType,
    });
    const [modalReact, setModalReact] = useState(false);
    const [position, setPosition] = useState({
        top: 0,
        left: 0,
    });
    const date = getTime(comment.date.toString());
    const { against, favor, reactionCommentType } = reactComment;
    useEffect(() => {
        if (position.top !== 0) {
            setModalReact(true);
        }
    }, [position]);

    return (
        <View style={{ marginBottom: 25 }}>
            <View style={{ ...styles.flex }}>
                <TouchableOpacity onPress={() => {}}>
                    <Text style={{ ...styles.user, ...styles.textbold }}>
                        @{comment.user.nickname}
                    </Text>
                </TouchableOpacity>
                <Text style={{ ...styles.text, fontSize: 13 }}> de </Text>
                <Text style={{ ...styles.text, fontSize: 13 }}>
                    {comment.user.university.shortname}
                </Text>

                <Text style={{ ...styles.text, ...styles.numberGray, marginLeft: 10 }}>{date}</Text>
                {uid !== comment.user.id && (
                    <>
                        <TouchableOpacity
                            style={{ ...styles.text, ...styles.numberGray, marginLeft: 10 }}
                            onPress={() => {}}
                        >
                            <FontAwesomeIcon icon={faReply} color="#E6E6E6" />
                        </TouchableOpacity>
                        {reactionCommentType === undefined && (
                            <TouchableOpacity
                                style={{ width: 18, marginLeft: 6 }}
                                onPress={event => {
                                    setPosition({
                                        top: event.nativeEvent.pageY,
                                        left: event.nativeEvent.pageX,
                                    });
                                }}
                            >
                                <IconGray
                                    color="#E6E6E6"
                                    underlayColor={'#01192ebe'}
                                    pressed={modalReact}
                                />
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </View>

            <View style={{ marginTop: 4, marginBottom: 0 }}>
                <MsgTransform
                    textStyle={{ ...styles.text, ...styles.msg }}
                    text={comment.comment}
                />
            </View>

            <View style={{ flexDirection: 'row' }}>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingVertical: 2,
                        borderRadius: 4,
                        backgroundColor: '#bebebe',
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
                <View style={{ flex: 1 }} />
            </View>

            <ModalReactComment
                setModalReact={setModalReact}
                modalReact={modalReact}
                position={position}
                commentId={comment.id}
                setReactComment={setReactComment}
            />
        </View>
    );
};

const stylescom = StyleSheet.create({
    text: {
        color: '#ffff',
        fontSize: 12,
        marginLeft: 2,
    },
});
