import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { faReply } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import { getTime } from '../helpers/getTime';
import { ComentarioInterface } from '../data/respuestas';
import IconGray from './svg/IconGray';
import { ModalReactComment } from './ModalReactComment';

interface Props {
    comment: ComentarioInterface;
}

export const Comment = ({ comment }: Props) => {
    const [reactComment, setReactComment] = useState(false);
    const [position, setPosition] = useState({
        top: 0,
        left: 0,
    });
    const uid = 1;
    const fecha = getTime(comment.fecha);

    useEffect(() => {
        if (position.top !== 0) {
            setReactComment(true);
        }
    }, [position]);

    return (
        <>
            <View style={stylescom.flex}>
                <TouchableOpacity onPress={() => {}}>
                    <Text style={{ ...styles.user, ...styles.textbold }}>
                        @{comment.usuario.alias}
                    </Text>
                </TouchableOpacity>
                <Text style={{ ...styles.text, fontSize: 13 }}> de </Text>
                <Text style={{ ...styles.text, fontSize: 13 }}>
                    {comment.usuario.universidad.alias}
                </Text>

                <Text style={{ ...styles.text, ...styles.numberGray, marginLeft: 10 }}>
                    {fecha}
                </Text>
                {uid !== comment.usuario.id_usuario && (
                    <>
                        <TouchableOpacity
                            style={{ ...styles.text, ...styles.numberGray, marginLeft: 10 }}
                            onPress={() => {}}
                        >
                            <FontAwesomeIcon icon={faReply} color="#E6E6E6" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ width: 18, marginLeft: 6 }}
                            onPress={(event) => {
                                setPosition({
                                    top: event.nativeEvent.pageY,
                                    left: event.nativeEvent.pageX,
                                });
                            }}
                        >
                            <IconGray underlayColor={'#01192ebe'} pressed={reactComment} />
                        </TouchableOpacity>
                    </>
                )}
            </View>

            <Text style={{ ...styles.text, ...styles.msg, marginTop: 4, marginBottom: 25 }}>
                {comment.respuesta}
            </Text>
            <ModalReactComment setReactComment={setReactComment} reactComment={reactComment} position={position}/>
        </>
    );
};

const stylescom = StyleSheet.create({
    flex: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
});
