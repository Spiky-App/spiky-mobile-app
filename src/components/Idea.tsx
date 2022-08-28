import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { faCheck, faLightbulb, faMessage, faMinus, faXmark } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import { getTime } from '../helpers/getTime';
import { ModalIdeaOptions } from './ModalIdeaOptions';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons/faThumbtack';
import { Message, ReactionType } from '../types/store';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import MsgTransform from './MsgTransform';
import { useAnimation } from '../hooks/useAnimation';
import SpikyService from '../services/SpikyService';
import { setMessages } from '../store/feature/messages/messagesSlice';
import { generateMessageFromMensaje } from '../helpers/message';

interface Props {
    idea: Message;
    index: number;
}

const reactioTypes: ['neutral', 'favor', 'against'] = ['neutral', 'favor', 'against'];

export const Idea = ({ idea }: Props) => {
    const uid = useAppSelector((state: RootState) => state.user.id);
    const messages = useAppSelector((state: RootState) => state.messages.messages);
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const service = new SpikyService(config);
    const dispatch = useAppDispatch();
    const navigation = useNavigation<any>();
    const [ideaOptions, setIdeaOptions] = useState(false);
    const { opacity, fadeIn } = useAnimation();
    const [position, setPosition] = useState({
        top: 0,
        left: 0,
    });
    const {
        id,
        message,
        date,
        user,
        against,
        answersNumber,
        messageTrackingId,
        reactionType,
        sequence,
        favor,
    } = idea;

    const isOwner = user.id === uid;
    const fecha = getTime(date.toString());

    const handleReaction = (reactionTypeAux: number) => {
        service.createReactionMsg(uid, id, reactionTypeAux);

        const messagesUpdated = messages.map(msg => {
            if (msg.id === id) {
                return {
                    ...msg,
                    [reactioTypes[reactionTypeAux]]: msg[reactioTypes[reactionTypeAux]] + 1,
                    reactionType: reactionTypeAux,
                };
            } else {
                return msg;
            }
        });
        dispatch(setMessages(messagesUpdated));
    };

    const handleOpenIdea = async () => {
        const response = await service.getMessageAndComments(id);
        const { data } = response;
        const { mensaje, num_respuestas } = data;
        const messagesRetrived: Message = generateMessageFromMensaje({
            ...mensaje,
            num_respuestas: num_respuestas,
        });

        navigation.navigate('OpenedIdeaScreen', {
            message: messagesRetrived,
        });
    };

    useEffect(() => {
        if (position.top !== 0) {
            setIdeaOptions(value => !value);
        }
    }, [position]);

    useEffect(() => {
        fadeIn(350, () => {}, sequence * 150);
    }, []);

    return (
        <Animated.View style={{ ...stylescom.wrap, opacity }}>
            <View style={stylescom.subwrap}>
                {isOwner && (
                    <View style={stylescom.corner}>
                        <View style={{ transform: [{ rotate: '-45deg' }] }}>
                            <FontAwesomeIcon icon={faLightbulb} color="white" size={13} />
                        </View>
                    </View>
                )}

                {messageTrackingId && (
                    <View style={{ ...stylescom.corner, backgroundColor: '#FC702A' }}>
                        <View>
                            <FontAwesomeIcon icon={faThumbtack} color="white" size={13} />
                        </View>
                    </View>
                )}

                <View style={styles.flex}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('ProfileScreen', {
                                alias: user.nickname,
                            });
                        }}
                    >
                        <Text style={{ ...stylescom.user, ...styles.textbold }}>
                            @{user.nickname}
                        </Text>
                    </TouchableOpacity>
                    <Text style={{ ...styles.text, fontSize: 13 }}> de </Text>
                    <Text style={{ ...styles.text, fontSize: 13 }}>
                        {user.university.shortname}
                    </Text>
                </View>

                <View style={{ marginTop: 6 }}>
                    <MsgTransform textStyle={{ ...styles.text, ...stylescom.msg }} text={message} />
                </View>

                <View
                    style={{
                        ...stylescom.container,
                        marginTop: 2,
                        justifyContent: 'space-between',
                    }}
                >
                    {reactionType === undefined && !isOwner ? (
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
                                            reactionType === ReactionType.AGAINST
                                                ? '#6A000E'
                                                : '#bebebe'
                                        }
                                        size={12}
                                    />
                                    <Text style={{ ...styles.text, ...stylescom.number }}>
                                        {against === 0 ? '' : against}
                                    </Text>
                                </View>

                                <View style={stylescom.reaction}>
                                    <FontAwesomeIcon
                                        icon={faCheck}
                                        color={
                                            reactionType === ReactionType.FAVOR
                                                ? '#0B5F00'
                                                : '#bebebe'
                                        }
                                        size={12}
                                    />
                                    <Text style={{ ...styles.text, ...stylescom.number }}>
                                        {favor === 0 ? '' : favor}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={stylescom.reaction}
                                    onPress={handleOpenIdea}
                                >
                                    <FontAwesomeIcon icon={faMessage} color={'#bebebe'} size={12} />
                                    <Text style={{ ...styles.text, ...stylescom.number }}>
                                        {answersNumber === 0 ? '' : answersNumber}
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
                                    myIdea={isOwner}
                                    messageId={id}
                                    messageTrackingId={messageTrackingId}
                                />
                            </View>
                        </>
                    )}
                </View>
            </View>
        </Animated.View>
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
    },
    user: {
        fontWeight: '600',
        fontSize: 13,
    },
    msg: {
        fontSize: 13,
        textAlign: 'left',
        flexShrink: 1,
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
