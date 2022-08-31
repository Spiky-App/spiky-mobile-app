import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Text, TouchableOpacity, View } from 'react-native';
import { faReply } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import { getTime } from '../helpers/getTime';
import { ModalReactComment } from './ModalReactComment';
// import { faCheck } from '../constants/icons/FontAwesome';
// import IconGray from './svg/IconGray';
import { MessageComment } from '../types/store';

interface Props {
    comment: MessageComment;
}

export const Comment = ({ comment }: Props) => {
    const [reactComment, setReactComment] = useState(false);
    const [position] = useState({
        top: 0,
        left: 0,
    });
    const uid = 1;
    const fecha = getTime(comment.date.toString());

    useEffect(() => {
        if (position.top !== 0) {
            setReactComment(true);
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

                <Text style={{ ...styles.text, ...styles.numberGray, marginLeft: 10 }}>
                    {fecha}
                </Text>
                {uid !== comment.user.id && (
                    <>
                        <TouchableOpacity
                            style={{ ...styles.text, ...styles.numberGray, marginLeft: 10 }}
                            onPress={() => {}}
                        >
                            <FontAwesomeIcon icon={faReply} color="#E6E6E6" />
                        </TouchableOpacity>
                        {/* {comment.resp_reacciones.length === 0 && (
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
                                    pressed={reactComment}
                                />
                            </TouchableOpacity>
                        )} */}
                    </>
                )}
            </View>

            <Text style={{ ...styles.text, ...styles.msg, marginTop: 4, marginBottom: 0 }}>
                {comment.comment}
            </Text>

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
                    {/* {comment.resp_reaccion_2 && (
                        <View
                            style={{
                                flexDirection: 'row',
                                paddingHorizontal: 4,
                                ...styles.center,
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faXmark}
                                color={comment.resp_reacciones[0]?.tipo === 2 ? '#01192E' : 'white'}
                                size={14}
                            />
                            <Text style={{ ...styles.text, ...stylescom.text }}>2</Text>
                        </View>
                    )}
                    {comment.resp_reaccion_1 && (
                        <View
                            style={{
                                flexDirection: 'row',
                                paddingHorizontal: 4,
                                ...styles.center,
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faCheck}
                                color={comment.resp_reacciones[0]?.tipo === 1 ? '#01192E' : 'white'}
                                size={14}
                            />
                            <Text style={{ ...styles.text, ...stylescom.text }}>2</Text>
                        </View>
                    )} */}
                </View>
                <View style={{ flex: 1 }} />
            </View>

            <ModalReactComment
                setReactComment={setReactComment}
                reactComment={reactComment}
                position={position}
            />
        </View>
    );
};

// const stylescom = StyleSheet.create({
//     text: {
//         color: '#ffff',
//         fontSize: 12,
//         marginLeft: 2,
//     },
// });
