import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    FlatList,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View,
} from 'react-native';
import { Comment } from '../components/Comment';
import {
    faArrowLeftLong,
    faCheck,
    faLightbulb,
    faMessage,
    faMinus,
    faThumbtack,
    faXmark,
} from '../constants/icons/FontAwesome';
import { ideas } from '../data/ideas';
import { comentarios } from '../data/respuestas';
import { getTime } from '../helpers/getTime';
import { styles } from '../themes/appTheme';

import { InputComment } from '../components/InputComment';
import { ModalIdeaOptions } from '../components/ModalIdeaOptions';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import SpikyService from '../services/SpikyService';
import { RootState } from '../store';
import { setMessages } from '../store/feature/messages/messagesSlice';

let ideaOutComments = ideas[1];
let idea = { ...ideaOutComments, respuestas: comentarios };
const reactioTypes: ['neutral', 'favor', 'against'] = ['neutral', 'favor', 'against'];

export const OpenedIdeaScreen = () => {
    const uid = 1;
    const messages = useAppSelector((state: RootState) => state.messages.messages);
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const service = new SpikyService(config);
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const fecha = getTime(idea.fecha);
    const { top, bottom } = useSafeAreaInsets();
    const [ideaOptions, setIdeaOptions] = useState(false);
    const [position, setPosition] = useState({
        top: 0,
        left: 0,
    });

    const handleReaction = (reactionType: number) => {
        service.createReactionMsg(uid, ideaOutComments.id_mensaje, reactionType);

        const messagesUpdated = messages.map(msg => {
            if (msg.id === ideaOutComments.id_mensaje) {
                msg[reactioTypes[reactionType]] = msg[reactioTypes[reactionType]] + 1;
                msg.reactionType = reactionType;
            }
            return msg;
        });
        dispatch(setMessages(messagesUpdated));
    };

    useEffect(() => {
        if (position.top !== 0) {
            setIdeaOptions(value => !value);
        }
    }, [position]);

    return (
        <KeyboardAvoidingView
            behavior="height"
            style={{
                width: '100%',
                alignItems: 'center',
                marginTop: top + 10,
                marginBottom: bottom,
                flex: 1,
                position: 'relative',
            }}
        >
            <TouchableOpacity
                style={{ position: 'absolute', top: 0, left: 0, marginLeft: 20 }}
                onPress={() => navigation.goBack()}
            >
                <FontAwesomeIcon icon={faArrowLeftLong} color="#bebebe" />
            </TouchableOpacity>

            <View style={stylescom.wrap}>
                {uid === idea.id_usuario && (
                    <View style={stylescom.pin}>
                        <View>
                            <FontAwesomeIcon icon={faLightbulb} color="white" size={13} />
                        </View>
                    </View>
                )}

                {idea.trackings.length > 0 && (
                    <View style={{ ...stylescom.pin, backgroundColor: '#FC702A' }}>
                        <View style={{ transform: [{ rotate: '45deg' }] }}>
                            <FontAwesomeIcon icon={faThumbtack} color="white" size={13} />
                        </View>
                    </View>
                )}

                <View style={stylescom.flex}>
                    <TouchableOpacity onPress={() => {}}>
                        <Text style={{ ...styles.user, ...styles.textbold }}>
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
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    {/* {!idea.reactionType && !isOwner ? ( */}
                    {idea.reacciones.length === 0 ? (
                        <View style={{ ...stylescom.container, ...stylescom.containerReact }}>
                            <TouchableHighlight
                                style={stylescom.reactButton}
                                underlayColor="#01192E"
                                onPress={() => handleReaction(2)}
                            >
                                <FontAwesomeIcon icon={faXmark} color="white" size={18} />
                            </TouchableHighlight>

                            <TouchableHighlight
                                style={stylescom.reactButton}
                                underlayColor="#01192E"
                                onPress={() => handleReaction(1)}
                            >
                                <FontAwesomeIcon icon={faCheck} color="white" size={18} />
                            </TouchableHighlight>

                            <TouchableHighlight
                                style={stylescom.reactButton}
                                underlayColor="#01192E"
                                onPress={() => handleReaction(0)}
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
                                    <Text style={{ ...styles.text, ...styles.numberGray }}>
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
                                    <Text style={{ ...styles.text, ...styles.numberGray }}>
                                        {idea.favor === 0 ? '' : idea.favor}
                                    </Text>
                                </View>

                                <View style={stylescom.reaction}>
                                    <FontAwesomeIcon icon={faMessage} color={'#bebebe'} size={12} />
                                    <Text style={{ ...styles.text, ...styles.numberGray }}>
                                        {idea.num_respuestas}
                                    </Text>
                                </View>
                            </View>

                            <View style={{ ...stylescom.container, alignItems: 'center' }}>
                                <Text style={{ ...styles.text, ...styles.numberGray }}>
                                    {fecha}
                                </Text>

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
                                    messageId={1}
                                    messageTrackingId={1}
                                />
                            </View>
                        </>
                    )}
                </View>
            </View>

            {/* Line gray  */}
            <View
                style={{ width: '90%', borderBottomWidth: 2, borderBottomColor: '#eeeeee' }}
            ></View>

            {idea.reacciones.length !== 0 ? (
                <>
                    {idea.respuestas.length !== 0 ? (
                        <FlatList
                            style={{ flex: 1, width: '80%', marginTop: 20 }}
                            data={comentarios}
                            renderItem={({ item }) => <Comment comment={item} />}
                            keyExtractor={item => item.id_respuesta + ''}
                            showsVerticalScrollIndicator={false}
                        />
                    ) : (
                        <View style={stylescom.center}>
                            <Text style={{ ...styles.text, ...stylescom.textGrayPad }}>
                                Se el primero en contribuir a esta idea.
                            </Text>
                        </View>
                    )}
                    <InputComment />
                </>
            ) : (
                <View style={stylescom.center}>
                    <Text style={{ ...styles.text, ...stylescom.textGrayPad }}>
                        Toma una postura antes de participar
                    </Text>
                </View>
            )}
        </KeyboardAvoidingView>
    );
};

const stylescom = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flex: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    wrap: {
        width: '75%',
        paddingBottom: 10,
        marginTop: 25,
        // backgroundColor: 'green'
    },
    msg: {
        fontSize: 13,
        fontWeight: '300',
        textAlign: 'justify',
        flexShrink: 1,
        width: '100%',
        marginVertical: 8,
    },
    reactButton: {
        backgroundColor: '#D4D4D4',
        borderRadius: 2,
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 3,
    },
    reaction: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginRight: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dots: {
        fontWeight: '600',
        color: '#bebebe',
        fontSize: 22,
        marginLeft: 20,
    },
    containerReact: {
        justifyContent: 'space-around',
        flex: 1,
        flexDirection: 'row',
        marginTop: 8,
    },
    textGrayPad: {
        color: '#707070',
        fontSize: 14,
    },
    pin: {
        position: 'absolute',
        top: -4,
        right: 0,
        // transform: [{ rotate: '45deg' }],
        backgroundColor: '#01192E',
        borderRadius: 6,
        width: 35,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
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
