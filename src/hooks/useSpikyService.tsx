import { useCallback, useContext, useEffect, useState } from 'react';
import SpikyService from '../services/SpikyService';
import { RootState } from '../store';
import { addToast } from '../store/feature/toast/toastSlice';
import { setModalAlert } from '../store/feature/ui/uiSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { StatusType } from '../types/common';
import { ChatMessage, Comment, Conversation, Message } from '../types/store';
import {
    faFlag,
    faThumbtack,
    faPaperPlane,
    faLock,
    faAddressCard,
} from '../constants/icons/FontAwesome';
import { setMessages } from '../store/feature/messages/messagesSlice';
import { generateMessageFromMensaje } from '../helpers/message';
import {
    generateChatMsgFromChatMensaje,
    generateConversationFromConversacion,
} from '../helpers/conversations';
import {
    increaseNewChatMessagesNumber,
    setUser,
    setNotificationsAndNewChatMessagesNumber,
    updateNewChatMessagesNumber,
} from '../store/feature/user/userSlice';
import { signIn, signOut } from '../store/feature/auth/authSlice';
import {
    restartConfig,
    updateServiceConfig,
} from '../store/feature/serviceConfig/serviceConfigSlice';
import { removeUser } from '../store/feature/user/userSlice';
import { StorageKeys } from '../types/storage';
import { decodeToken } from '../utils/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateNotificationsFromNotificacion } from '../helpers/notification';
import { MessageRequestData } from '../services/models/spikyService';
import SocketContext from '../context/Socket/Context';
import { generateReactionFromReaccion } from '../helpers/reaction';
import { NavigationProp } from '@react-navigation/native';

function useSpikyService() {
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const user = useAppSelector((state: RootState) => state.user);
    const messages = useAppSelector((state: RootState) => state.messages.messages);
    const chats = useAppSelector((state: RootState) => state.chats);
    const dispatch = useAppDispatch();
    const { socket } = useContext(SocketContext);
    const [service, setService] = useState<SpikyService>(new SpikyService(config));
    const token = useAppSelector((state: RootState) => state.auth.token);
    useEffect(() => {
        if (token) {
            const decoded_token = decodeToken(token);
            const exp_date = JSON.parse(decoded_token.toString()).exp;
            const value = new Date().setTime(exp_date * 1000);
            if (Date.now() > value) {
                logOutFunction();
            }
        }
    }, []);

    useEffect(() => {
        setService(new SpikyService(config));
    }, [config]);

    const logOutFunction = async () => {
        try {
            const deviceTokenStorage = await AsyncStorage.getItem(StorageKeys.DEVICE_TOKEN);
            if (deviceTokenStorage) {
                await service.deleteDeviceToken(deviceTokenStorage);
            }
            await AsyncStorage.removeItem(StorageKeys.TOKEN);
            dispatch(signOut());
            dispatch(restartConfig());
            dispatch(removeUser());
        } catch (error) {
            console.log(error);
            dispatch(addToast({ message: 'Error al cerrar sesión', type: StatusType.WARNING }));
        }
    };

    const createMessageComment = useCallback(
        async (
            messageId: number,
            toUser: number,
            comment: string
        ): Promise<Comment | undefined> => {
            let messageComment: Comment | undefined = undefined;
            try {
                const { data } = await service.createMessageComment(messageId, user.id, comment);
                const { respuesta } = data;
                messageComment = {
                    id: respuesta.id_respuesta,
                    comment: respuesta.respuesta,
                    date: respuesta.fecha,
                    messageId: respuesta.id_mensaje,
                    user: {
                        id: user.id,
                        nickname: user.nickname,
                        universityId: user.universityId,
                    },
                    favor: 0,
                    against: 0,
                };
                const messagesUpdated = messages.map(msg => {
                    return msg.id === messageId
                        ? { ...msg, answersNumber: msg.answersNumber + 1 }
                        : msg;
                });
                if (toUser !== user.id) {
                    socket?.emit('notify', {
                        id_usuario1: toUser,
                        id_usuario2: user.id,
                        id_mensaje: messageId,
                        tipo: 2,
                    });
                }

                const regexp = /(@\[@\w*\]\(\d*\))/g;
                const mentions: RegExpMatchArray | null = messageComment.comment.match(regexp);
                if (mentions) {
                    socket?.emit('mentions', {
                        mentions,
                        id_usuario2: user.id,
                        id_mensaje: messageComment.messageId,
                        tipo: 4,
                    });
                }
                dispatch(setMessages(messagesUpdated));
            } catch {
                dispatch(
                    addToast({ message: 'Error creando respuesta', type: StatusType.WARNING })
                );
            }
            return messageComment;
        },
        [service, user]
    );

    const createReportIdea = async (
        messageId: number,
        reportReason: string,
        onChange: (
            stateUpdated: Partial<{
                reportReason: string;
            }>
        ) => void,
        navigation: NavigationProp<
            ReactNavigation.RootParamList,
            never,
            undefined,
            Readonly<{
                key: string;
                index: number;
                routeNames: never[];
                history?: unknown[] | undefined;
                routes: any;
                type: string;
                stale: false;
            }>,
            {},
            {}
        >
    ) => {
        try {
            const response = await service.createReportIdea(user.id, messageId, reportReason);
            const { data } = response;
            const { msg } = data;
            onChange({ reportReason: '' });
            navigation.goBack();
            dispatch(setModalAlert({ isOpen: true, text: msg, icon: faFlag }));
        } catch (error) {
            console.log(error);
            onChange({ reportReason: '' });
            navigation.goBack();
            dispatch(addToast({ message: 'Error al reportar', type: StatusType.WARNING }));
        }
    };

    const createTracking = async (messageId: number) => {
        const response = await service.createTracking(user.id, messageId);
        const { data } = response;
        const { id_tracking } = data;

        const messagesUpdated = messages.map(msg => {
            if (msg.id === messageId) {
                return { ...msg, messageTrackingId: id_tracking };
            } else {
                return msg;
            }
        });
        dispatch(
            setModalAlert({
                isOpen: true,
                text: 'Tracking activado',
                color: '#FC702A',
                icon: faThumbtack,
            })
        );
        dispatch(setMessages(messagesUpdated));
        return id_tracking;
    };

    const deleteTracking = async (messageId: number, filter?: string) => {
        await service.deleteTracking(messageId);

        let messagesUpdated: Message[];

        if (filter === '/tracking') {
            messagesUpdated = messages.filter(msg => msg.id !== messageId);
        } else {
            messagesUpdated = messages.map(msg => {
                if (msg.id === messageId) {
                    return { ...msg, messageTrackingId: undefined };
                } else {
                    return msg;
                }
            });
        }

        dispatch(setModalAlert({ isOpen: true, text: 'Tracking desactivado', icon: faThumbtack }));
        dispatch(setMessages(messagesUpdated));
    };

    const createChatMsgWithReply = async (
        userId: number = 0,
        messageId: number,
        chatMessage: string,
        navigation: NavigationProp<
            ReactNavigation.RootParamList,
            never,
            undefined,
            Readonly<{
                key: string;
                index: number;
                routeNames: never[];
                history?: unknown[] | undefined;
                routes: any;
                type: string;
                stale: false;
            }>,
            {},
            {}
        >
    ) => {
        try {
            const response = await service.createChatMsgWithReply(userId, messageId, chatMessage);
            const { data } = response;
            const { content } = data;
            const { userto, conver, newConver } = content;
            const converRetrived = generateConversationFromConversacion(conver, user.id);
            navigation.goBack();
            dispatch(setModalAlert({ isOpen: true, text: 'Mensaje enviado', icon: faPaperPlane }));
            return { userto, newConver, conver: converRetrived };
        } catch (error) {
            console.log(error);
            navigation.goBack();
            dispatch(addToast({ message: 'Error al crear mensaje', type: StatusType.WARNING }));
        }
    };

    const getConversations = async () => {
        try {
            const response = await service.getConversations();
            const { data } = response;
            const { convers } = data;
            const conversationsRetrived: Conversation[] = convers.map(conver => {
                return generateConversationFromConversacion(conver, user.id);
            });
            return conversationsRetrived;
        } catch (error) {
            console.log(error);
            dispatch(addToast({ message: 'Error al crear mensaje', type: StatusType.WARNING }));
            return [];
        }
    };

    const getChatMessages = async (conversationId: number, lastChatMessageId?: number) => {
        try {
            const response = await service.getChatMessages(conversationId, lastChatMessageId);
            const { data } = response;
            const { chatmensajes, n_chatmensajes_unseens } = data;
            const chatMessagesRetrived: ChatMessage[] = chatmensajes.map(chatmsg => {
                return generateChatMsgFromChatMensaje(chatmsg, user.id);
            });
            dispatch(
                updateNewChatMessagesNumber(user.newChatMessagesNumber - n_chatmensajes_unseens)
            );
            return chatMessagesRetrived;
        } catch (error) {
            console.log(error);
            dispatch(
                addToast({ message: 'Error al cargar los mensajes', type: StatusType.WARNING })
            );
            return [];
        }
    };

    const createChatMessage = async (conversationId: number, chatMessage: string) => {
        try {
            const response = await service.createChatMessage(conversationId, chatMessage);
            const { data } = response;
            const { chatmensaje } = data;
            const chatMessageRetrived: ChatMessage = generateChatMsgFromChatMensaje(
                chatmensaje,
                user.id
            );

            return chatMessageRetrived;
        } catch (error) {
            console.log(error);
            dispatch(addToast({ message: 'Error al crear el mensajes', type: StatusType.WARNING }));
        }
    };

    const createChatMessageSeen = async (chatMessageId: number) => {
        try {
            const response = await service.createChatMessageSeen(chatMessageId);
            const { data } = response;
            const { content } = data;
            const { chatmsg_seen, userto } = content;
            return {
                conversationId: chatmsg_seen.id_conversacion,
                chatMessageId,
                toUser: userto,
            };
        } catch (error) {
            console.log(error);
            dispatch(addToast({ message: 'Error al crear el mensajes', type: StatusType.WARNING }));
        }
    };
    const createIdea = async (message: string, draft?: boolean) => {
        let createdMessage: Message | undefined = undefined;
        try {
            const response = await service.createMessage(message, draft ? 1 : 0);
            const { data } = response;
            const { mensaje } = data;
            createdMessage = generateMessageFromMensaje({
                ...mensaje,
                usuario: {
                    alias: user.nickname,
                    id_universidad: user.universityId,
                },
                reacciones: [],
            });

            const regexp = /(@\[@\w*\]\(\d*\))/g;
            const mentions: RegExpMatchArray | null = createdMessage.message.match(regexp);
            if (mentions) {
                socket?.emit('mentions', {
                    mentions,
                    id_usuario2: user.id,
                    id_mensaje: createdMessage.id,
                    tipo: 4,
                });
            }
        } catch {
            dispatch(addToast({ message: 'Error creando idea', type: StatusType.WARNING }));
        }
        return createdMessage;
    };
    const updateDraft = async (message: string, id: number, post: boolean) => {
        let createdMessage: Message | undefined = undefined;
        try {
            const response = await service.updateDraft(message, id, post);
            const { data } = response;
            const { mensaje } = data;
            createdMessage = generateMessageFromMensaje({
                ...mensaje,
                usuario: {
                    alias: user.nickname,
                    id_universidad: user.universityId,
                },
                reacciones: [],
            });
        } catch (error) {
            console.log(error);
            dispatch(
                addToast({ message: 'Error actualizando borrador', type: StatusType.WARNING })
            );
        }
        return createdMessage;
    };
    const createReactionMsg = (messageId: number, reaction: string[0]) => {
        service.createReactionMsg(user.id, messageId, reaction);
        const messagesUpdated = messages.map((msg: Message) => {
            if (msg.id === messageId) {
                socket?.emit('notify', {
                    id_usuario1: msg.user.id,
                    id_usuario2: user.id,
                    id_mensaje: msg.id,
                    tipo: 1,
                });
                let isNew = true;
                let reactions = msg.reactions.map(r => {
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
                    reactions = [...reactions, { reaction, count: 1 }];
                }
                return {
                    ...msg,
                    reactions,
                    myReaction: reaction,
                };
            } else {
                return msg;
            }
        });
        dispatch(setMessages(messagesUpdated));
    };
    const deleteIdea = async (messageId: number) => {
        service.deleteMessage(messageId);
    };
    const updateNotifications = async (arrayIds: number[]) => {
        service.updateNotifications(arrayIds);
    };
    const retrieveNotifications = async () => {
        try {
            const response = await service.getNotifications();
            const { data } = response;
            const { notificaciones } = data;
            return notificaciones.map(n => generateNotificationsFromNotificacion(n));
        } catch (error) {
            console.log(error);
            dispatch(
                addToast({ message: 'Error al obtener notificaciones', type: StatusType.WARNING })
            );
            return [];
        }
    };
    const createReactionToComment = (
        commentId: number,
        reactionTypeAux: number,
        messageId: number,
        toUser: number
    ) => {
        service.createReactionCmt(commentId, reactionTypeAux);
        socket?.emit('notify', {
            id_usuario1: toUser,
            id_usuario2: user.id,
            id_mensaje: messageId,
            tipo: 5,
        });
    };

    const getUsersSuggestions = async (word: string) => {
        try {
            const response = await service.getUserSuggestions(word);
            const { data } = response;
            const { usuarios } = data;
            return usuarios;
        } catch (error) {
            console.log(error);
            return [];
        }
    };
    const getHashtagsSuggestions = async (word: string) => {
        try {
            const response = await service.getHashtagsSuggestions(word);
            const { data } = response;
            const { hashtags } = data;
            return word === 'anyhashtag0320'
                ? hashtags
                : [{ hashtag: word, id_hashtag: 0 }, ...hashtags];
        } catch (error) {
            console.log(error);
            return [];
        }
    };
    const getIdeaWithComments = async (messageId: number) => {
        const response = await service.getMessageAndComments(messageId);
        const { data } = response;
        const { mensaje, num_respuestas } = data;
        return generateMessageFromMensaje({
            ...mensaje,
            num_respuestas: num_respuestas,
        });
    };
    const loadUserInfo = async () => {
        const response = await service.getUserInfo();
        const { data: fetchData } = response;
        const { usuario } = fetchData;
        return usuario;
    };
    const updatePassword = async (uid: number, currentPassword: string, newPassword: string) => {
        await service.updatePassword(uid, currentPassword, newPassword);
        dispatch(
            setModalAlert({
                isOpen: true,
                text: 'Contraseña restablecida',
                icon: faLock,
            })
        );
    };
    const updatePasswordUri = async (
        tokenEmail: string,
        correoValid: string,
        newPassword: string
    ) => {
        if (correoValid) {
            await service.updatePasswordUri(tokenEmail, correoValid, newPassword);
            dispatch(
                setModalAlert({
                    isOpen: true,
                    text: 'Contraseña restablecida',
                    icon: faLock,
                })
            );
        } else {
            console.log('[ERROR] no email sent in route params.');
            dispatch(
                addToast({
                    message: 'Por favor hable con el administrador.',
                    type: StatusType.WARNING,
                })
            );
        }
    };

    const getIdeas = async (
        uid: number,
        filter: string,
        lastMessageId: number | undefined,
        parameters: MessageRequestData
    ) => {
        try {
            const { data: messagesData } = await service.getMessages(
                uid,
                filter,
                lastMessageId,
                parameters
            );
            const { mensajes } = messagesData;
            return mensajes.map((mensaje, index) => {
                return generateMessageFromMensaje(mensaje, index);
            });
        } catch (error) {
            console.log(error);
            dispatch(addToast({ message: 'Error cargando mensajes', type: StatusType.WARNING }));
            return [];
        }
    };

    const getEmailVerification = async (email: string) => {
        try {
            const response = await service.getEmailVerification(email);
            const { data } = response;
            const { msg } = data;
            return msg;
        } catch (error) {
            console.log(error);
            dispatch(
                addToast({
                    message: 'Correo invalido, ingrese otro correo  ',
                    type: StatusType.WARNING,
                })
            );
            return null;
        }
    };

    const getIdeaReactiones = async (messageId: number) => {
        try {
            const { data } = await service.getIdeaReactions(messageId);
            const { reacciones } = data;
            return reacciones.map(reaccion => {
                return generateReactionFromReaccion(reaccion);
            });
        } catch (error) {
            console.log(error);
            dispatch(addToast({ message: 'Error cargando reacciones', type: StatusType.WARNING }));
            return [];
        }
    };

    const setNewChatMessagesNumber = (conversationId: number) => {
        if (chats.activeConversationId !== conversationId) {
            dispatch(increaseNewChatMessagesNumber());
        }
    };

    const getTermsAndConditions = async () => {
        const response = await service.getTermsAndConditions();
        const { data } = response;
        const { lists } = data;
        return lists;
    };

    const registerUser = async (
        sentToken: string,
        newUserAlias: string,
        newUserEmail: string,
        password: string
    ) => {
        try {
            const response = await service.registerUser(
                sentToken,
                newUserAlias,
                newUserEmail,
                password
            );
            const { data } = response;
            //const { ok, uid, alias, id_universidad, token, msg } = data;
            const { ok, msg } = data;
            if (!ok) {
                // in case of error, message from server is Por favor hable con el administrador
                dispatch(addToast({ message: msg, type: StatusType.WARNING }));
            } else {
                // in case of success, message from server is Registro exitoso
                dispatch(
                    setModalAlert({
                        isOpen: true,
                        text: msg,
                        icon: faAddressCard,
                    })
                );
            }
        } catch (error) {
            console.log(error);
            dispatch(addToast({ message: 'Error al crear cuenta', type: StatusType.WARNING }));
        }
    };

    const getPendingNotifications = async () => {
        try {
            const { data } = await service.getPendingNotifications();
            const { pendingNotifications } = data;
            const { newChatMessagesNumber, notificationsNumber } = pendingNotifications;
            dispatch(
                setNotificationsAndNewChatMessagesNumber({
                    newChatMessagesNumber,
                    notificationsNumber,
                })
            );
        } catch (error) {
            console.log(error);
        }
    };

    const handleForgotPassword = async (email: string) => {
        try {
            const response = await service.handleForgotPassword(email);
            const { data } = response;
            const { msg } = data;
            return msg;
        } catch (error) {
            console.log(error);
            dispatch(addToast({ message: 'Error enviado el correo', type: StatusType.WARNING }));
        }
    };

    const validateToken = async () => {
        const tokenStorage = await AsyncStorage.getItem(StorageKeys.TOKEN);
        if (tokenStorage) {
            try {
                const response = await service.getAuthRenew(tokenStorage);
                const { data } = response;
                const {
                    token: token_return,
                    alias,
                    n_notificaciones,
                    id_universidad,
                    uid,
                    n_chatmensajes,
                } = data;
                await AsyncStorage.setItem(StorageKeys.TOKEN, token_return);
                dispatch(updateServiceConfig({ headers: { 'x-token': token_return } }));
                dispatch(signIn(token_return));
                dispatch(
                    setUser({
                        nickname: alias,
                        notificationsNumber: n_notificaciones,
                        newChatMessagesNumber: n_chatmensajes,
                        universityId: id_universidad,
                        id: uid,
                    })
                );
            } catch {
                logOutFunction();
            }
        }
    };

    return {
        createMessageComment,
        createReportIdea,
        createTracking,
        deleteTracking,
        createChatMsgWithReply,
        getConversations,
        getChatMessages,
        createChatMessage,
        createChatMessageSeen,
        createIdea,
        updateDraft,
        createReactionMsg,
        deleteIdea,
        updateNotifications,
        retrieveNotifications,
        createReactionToComment,
        getUsersSuggestions,
        getHashtagsSuggestions,
        getIdeaWithComments,
        loadUserInfo,
        updatePassword,
        updatePasswordUri,
        getIdeas,
        getEmailVerification,
        getIdeaReactiones,
        setNewChatMessagesNumber,
        getTermsAndConditions,
        getPendingNotifications,
        handleForgotPassword,
        registerUser,
        validateToken,
        logOutFunction,
    };
}

export default useSpikyService;
