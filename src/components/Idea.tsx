import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { faCheck, faLightbulb, faMessage, faMinus, faXmark } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import { IdeaInterface } from '../data/ideas';
import { getTime } from '../helpers/getTime';
import { ModalIdeaOptions } from './ModalIdeaOptions';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons/faThumbtack';

interface Props {
    idea: IdeaInterface;
}

export const Idea = ({ idea }: Props) => {
    const uid = 1;
    const navigation = useNavigation<any>();
    const [ideaOptions, setIdeaOptions] = useState(false);
    const [position, setPosition] = useState({
        top: 0,
        left: 0,
    });

    if (idea.id_usuario === uid && idea.reacciones.length === 0) {
        idea.reacciones = [{}];
    }

    const fecha = getTime(idea.fecha);

    useEffect(() => {
        if (position.top !== 0) {
            setIdeaOptions(value => !value);
        }
    }, [position]);

    return (
        <View style={stylescom.wrap}>
            <View style={stylescom.subwrap}>
                {uid === idea.id_usuario && (
                    <View style={stylescom.corner}>
                        <View style={{ transform: [{ rotate: '-45deg' }] }}>
                            <FontAwesomeIcon icon={faLightbulb} color="white" size={13} />
                        </View>
                    </View>
                )}

                {idea.trackings.length > 0 && (
                    <View style={{ ...stylescom.corner, backgroundColor: '#FC702A' }}>
                        <View>
                            <FontAwesomeIcon icon={faThumbtack} color="white" size={13} />
                        </View>
                    </View>
                )}

                <View style={styles.flex}>
                    <TouchableOpacity onPress={() => {}}>
                        <Text style={{ ...stylescom.user, ...styles.textbold }}>
                            @{idea.usuario.alias}
                        </Text>
                    </TouchableOpacity>
                    <Text style={{ ...styles.text, fontSize: 13 }}> de </Text>
                    <Text style={{ ...styles.text, fontSize: 13 }}>
                        {idea.usuario.universidad.alias}
                    </Text>
                </View>

                <Text style={{ ...styles.text, ...stylescom.msg }}>{idea.mensaje}</Text>

                <View
                    style={{
                        ...stylescom.container,
                        marginTop: 2,
                        justifyContent: 'space-between',
                    }}
                >
                    {idea.reacciones.length === 0 ? (
                        <View style={{ ...stylescom.container, ...stylescom.containerReact }}>
                            <TouchableHighlight
                                style={stylescom.reactButton}
                                underlayColor="#01192E"
                                onPress={() => {}}
                            >
                                <FontAwesomeIcon icon={faXmark} color="white" size={18} />
                            </TouchableHighlight>

                            <TouchableHighlight
                                style={stylescom.reactButton}
                                underlayColor="#01192E"
                                onPress={() => {}}
                            >
                                <FontAwesomeIcon icon={faCheck} color="white" size={18} />
                            </TouchableHighlight>

                            <TouchableHighlight
                                style={stylescom.reactButton}
                                underlayColor="#01192E"
                                onPress={() => {}}
                            >
                                <FontAwesomeIcon icon={faMinus} color="white" size={18} />
                            </TouchableHighlight>
                        </View>
                    ) : (
                        <>
                            <View style={stylescom.container}>
                                <View style={stylescom.reaction}>
                                    <FontAwesomeIcon
                                        icon={faXmark}
                                        color={
                                            idea.reacciones[0].tipo === 2 ? '#6A000E' : '#bebebe'
                                        }
                                        size={12}
                                    />
                                    <Text style={{ ...styles.text, ...stylescom.number }}>
                                        {idea.contra === 0 ? '' : idea.contra}
                                    </Text>
                                </View>

                                <View style={stylescom.reaction}>
                                    <FontAwesomeIcon
                                        icon={faCheck}
                                        color={
                                            idea.reacciones[0].tipo === 1 ? '#0B5F00' : '#bebebe'
                                        }
                                        size={12}
                                    />
                                    <Text style={{ ...styles.text, ...stylescom.number }}>
                                        {idea.favor === 0 ? '' : idea.favor}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={stylescom.reaction}
                                    onPress={() => navigation.navigate('OpenedIdeaScreen')}
                                >
                                    <FontAwesomeIcon icon={faMessage} color={'#bebebe'} size={12} />
                                    <Text style={{ ...styles.text, ...stylescom.number }}>
                                        {idea.num_respuestas}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={stylescom.container}>
                                <Text style={{ ...styles.text, ...stylescom.number }}>{fecha}</Text>

                                <TouchableOpacity
                                    onPress={event => {
                                        setPosition({
                                            top: event.nativeEvent.pageY,
                                            left: event.nativeEvent.pageX,
                                        });
                                    }}
                                >
                                    <Text style={{ ...styles.textbold, ...stylescom.dots }}>
                                        ...
                                    </Text>
                                </TouchableOpacity>

                                <ModalIdeaOptions
                                    setIdeaOptions={setIdeaOptions}
                                    ideaOptions={ideaOptions}
                                    position={position}
                                    myIdea={uid === idea.id_usuario}
                                />
                            </View>
                        </>
                    )}
                </View>
            </View>
        </View>
    );
};

const stylescom = StyleSheet.create({
    wrap: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 8,
        marginVertical: 8,
        shadowColor: '#4d4d4d',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 6,
    },
    subwrap: {
        paddingTop: 15,
        paddingBottom: 8,
        paddingHorizontal: 25,
        borderRadius: 8,
        overflow: 'hidden',
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'red'
    },
    user: {
        fontWeight: '600',
        fontSize: 13,
    },
    msg: {
        fontSize: 13,
        fontWeight: '300',
        textAlign: 'justify',
        flexShrink: 1,
        width: '100%',
        marginTop: 6,
        // backgroundColor: 'red'
    },
    reaction: {
        flexDirection: 'row',
        marginRight: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    number: {
        fontWeight: '300',
        fontSize: 12,
        color: '#bebebe',
        marginLeft: 3,
    },
    dots: {
        fontWeight: '600',
        color: '#bebebe',
        fontSize: 22,
        marginLeft: 20,
    },
    reactButton: {
        backgroundColor: '#D4D4D4',
        borderRadius: 2,
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 3,
    },
    containerReact: {
        justifyContent: 'space-around',
        flex: 1,
        flexDirection: 'row',
        marginTop: 8,
    },
    corner: {
        position: 'absolute',
        top: -4,
        right: -28,
        transform: [{ rotate: '45deg' }],
        backgroundColor: '#01192E',
        paddingTop: 8,
        paddingBottom: 4,
        paddingHorizontal: 30,
    },
});
