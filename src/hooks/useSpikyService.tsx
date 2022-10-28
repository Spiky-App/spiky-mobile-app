import { useNavigation } from '@react-navigation/native';
import { useCallback, useContext, useEffect, useState } from 'react';
import SpikyService from '../services/SpikyService';
import { RootState } from '../store';
import { addToast } from '../store/feature/toast/toastSlice';
import { setModalAlert } from '../store/feature/ui/uiSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { StatusType } from '../types/common';
import { ChatMessage, Comment, Conversation, Message } from '../types/store';
import { faFlag, faThumbtack, faPaperPlane } from '../constants/icons/FontAwesome';
import { setMessages } from '../store/feature/messages/messagesSlice';
import { generateMessageFromMensaje } from '../helpers/message';
import {
    generateChatMsgFromChatMensaje,
    generateConversationFromConversacion,
} from '../helpers/conversations';
import {
    increaseNewChatMessagesNumber,
    updateNewChatMessagesNumber,
} from '../store/feature/user/userSlice';
import { signOut } from '../store/feature/auth/authSlice';
import { restartConfig } from '../store/feature/serviceConfig/serviceConfigSlice';
import { removeUser } from '../store/feature/user/userSlice';
import { StorageKeys } from '../types/storage';
import { decodeToken } from '../utils/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateNotificationsFromNotificacion } from '../helpers/notification';
import { MessageRequestData } from '../services/models/spikyService';
import SocketContext from '../context/Socket/Context';
import { generateReactionFromReaccion } from '../helpers/reaction';

function useSpikyService() {
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const user = useAppSelector((state: RootState) => state.user);
    const messages = useAppSelector((state: RootState) => state.messages.messages);
    const chats = useAppSelector((state: RootState) => state.chats);
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const { socket } = useContext(SocketContext);
    const [service, setService] = useState<SpikyService>(new SpikyService(config));
    const token = useAppSelector((state: RootState) => state.auth.token);
    useEffect(() => {
        if (token) {
            const decoded_token = decodeToken(token);
            const exp_date = JSON.parse(decoded_token.toString()).exp;
            const value = new Date().setTime(exp_date * 1000);
            if (Date.now() > value) {
                onExpiredToken();
            }
        }
    }, []);
    async function onExpiredToken() {
        await AsyncStorage.removeItem(StorageKeys.TOKEN);
        dispatch(signOut());
        dispatch(restartConfig());
        dispatch(removeUser());
    }
    useEffect(() => {
        setService(new SpikyService(config));
    }, [config]);

    const createMessageComment = useCallback(
        async (messageId: number, uid: number, comment: string): Promise<Comment | undefined> => {
            let messageComment: Comment | undefined = undefined;
            try {
                const { data } = await service.createMessageComment(messageId, uid, comment);
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
        ) => void
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
        chatMessage: string
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
        const messagesUpdated = messages.map(msg => {
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
    const createReactionToComment = async (commentId: number, reactionTypeAux: number) => {
        service.createReactionCmt(commentId, reactionTypeAux);
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
        getIdeas,
        getEmailVerification,
        getIdeaReactiones,
        setNewChatMessagesNumber,
    };
}

export default useSpikyService;
