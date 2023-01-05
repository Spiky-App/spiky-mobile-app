import { useEffect, useState } from 'react';
import SpikyService from '../services/SpikyService';
import { RootState } from '../store';
import { addToast } from '../store/feature/toast/toastSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { StatusType } from '../types/common';
import { signIn, signOut } from '../store/feature/auth/authSlice';
import {
    restartConfig,
    updateServiceConfig,
} from '../store/feature/serviceConfig/serviceConfigSlice';
import { removeUser, setUser } from '../store/feature/user/userSlice';
import { StorageKeys } from '../types/storage';
import { decodeToken } from '../utils/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MessageRequestData } from '../services/models/spikyService';
import { AxiosError } from 'axios';
import {
    ChatMessage,
    Conversation,
    GetChatMessages,
    HashtagI,
    Message,
    MessageComment,
    MessageWithReplyContent,
    Notification,
    PendingNotificationsI,
    Reaction,
    TermsAndConditions,
    UserI,
    UserInfo,
} from '../types/services/spiky';
import { Toast } from '../types/store';

function useSpikyService() {
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const dispatch = useAppDispatch();
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

    function handleSpikyServiceToast(error: unknown, defaultMessage: string): Toast {
        if (error instanceof AxiosError) {
            return {
                message:
                    error.message === 'Network Error' || error.message.startsWith('timeout')
                        ? 'Sin conexión a internet, revisa tu conexión.'
                        : error.response?.data?.msg,
                type: StatusType.WARNING,
            };
        }
        return {
            message: defaultMessage,
            type: StatusType.WARNING,
        };
    }

    async function logOutFunction() {
        try {
            const deviceTokenStorage = await AsyncStorage.getItem(StorageKeys.DEVICE_TOKEN);
            if (deviceTokenStorage) {
                await service.deleteDeviceToken(deviceTokenStorage);
            }
            await AsyncStorage.removeItem(StorageKeys.TOKEN);
            dispatch(restartConfig());
            dispatch(signOut());
            dispatch(removeUser());
        } catch (error) {
            console.log(error);
            dispatch(addToast(handleSpikyServiceToast(error, 'Error al cerrar sesión.')));
        }
    }

    const createMessageComment = async (
        messageId: number,
        uid: number,
        comment: string
    ): Promise<MessageComment | undefined> => {
        try {
            const response = await service.createMessageComment(messageId, uid, comment);
            return response.data.respuesta;
        } catch (error) {
            console.log(error);
            dispatch(addToast(handleSpikyServiceToast(error, 'Error creando respuesta.')));
        }
        return undefined;
    };

    const createReportIdea = async (
        messageId: number,
        reportReason: string,
        uid: number
    ): Promise<string | undefined> => {
        try {
            const response = await service.createReportIdea(uid, messageId, reportReason);
            return response.data.msg;
        } catch (error) {
            console.log(error);
            dispatch(addToast(handleSpikyServiceToast(error, 'Error al reportar mensaje.')));
        }
        return undefined;
    };

    const createTracking = async (messageId: number, uid: number): Promise<number | undefined> => {
        try {
            const response = await service.createTracking(uid, messageId);
            return response.data.id_tracking;
        } catch (error) {
            console.log(error);
            dispatch(addToast(handleSpikyServiceToast(error, 'Error siguiendo mensaje.')));
        }
        return undefined;
    };

    const deleteTracking = async (messageId: number): Promise<boolean> => {
        try {
            await service.deleteTracking(messageId);
            return true;
        } catch (error) {
            console.log(error);
            dispatch(
                addToast(handleSpikyServiceToast(error, 'Error dejando de siguiendo mensaje.'))
            );
        }
        return false;
    };

    const createChatMsgWithReply = async (
        userId: number,
        messageId: number,
        chatMessage: string
    ): Promise<MessageWithReplyContent | undefined> => {
        try {
            const response = await service.createChatMsgWithReply(userId, messageId, chatMessage);
            return response.data.content;
        } catch (error) {
            console.log(error);
            dispatch(addToast(handleSpikyServiceToast(error, 'Error al crear mensaje.')));
        }
        return undefined;
    };

    const getConversations = async (): Promise<{
        conversations: Conversation[];
        networkError?: boolean;
    }> => {
        try {
            const response = await service.getConversations();
            return { conversations: response.data.convers, networkError: false };
        } catch (error) {
            console.log(error);
            if (error instanceof AxiosError) {
                if (error.message === 'Network Error' || error.message.startsWith('timeout')) {
                    return { conversations: [], networkError: true };
                } else {
                    dispatch(
                        addToast(handleSpikyServiceToast(error, 'Error cargando conexiones.'))
                    );
                }
            } else {
                dispatch(addToast(handleSpikyServiceToast(error, 'Error cargando conexiones.')));
            }
        }
        return { conversations: [] };
    };

    const getChatMessages = async (
        conversationId: number,
        toUserId?: number,
        lastChatMessageId?: number,
        firstChatMessageId?: number
    ): Promise<{ chatMessagesResponse?: GetChatMessages; networkError?: boolean }> => {
        try {
            const response = await service.getChatMessages(
                conversationId,
                toUserId,
                lastChatMessageId,
                firstChatMessageId
            );
            return { chatMessagesResponse: response.data };
        } catch (error) {
            console.log(error);
            if (error instanceof AxiosError) {
                if (error.message === 'Network Error' || error.message.startsWith('timeout')) {
                    return { networkError: true };
                } else {
                    dispatch(
                        addToast(handleSpikyServiceToast(error, 'Error al cargar los mensajes.'))
                    );
                }
            } else {
                dispatch(addToast(handleSpikyServiceToast(error, 'Error al cargar los mensajes.')));
            }
        }
        return {};
    };

    const createChatMessage = async (
        conversationId: number,
        chatMessage: string,
        chatMessageRepliedId?: number
    ): Promise<ChatMessage | undefined> => {
        try {
            const response = await service.createChatMessage(
                conversationId,
                chatMessage,
                chatMessageRepliedId
            );
            return response.data.chatmensaje;
        } catch (error) {
            console.log(error);
            dispatch(addToast(handleSpikyServiceToast(error, 'Error al crear el mensaje.')));
        }
        return undefined;
    };

    const createChatMessageSeen = async (chatMessageId: number): Promise<void> => {
        try {
            await service.createChatMessageSeen(chatMessageId);
        } catch (error) {
            console.log(error);
            dispatch(addToast(handleSpikyServiceToast(error, 'Error al crear el mensajes.')));
        }
    };

    const createIdea = async (message: string, draft?: boolean): Promise<Message | undefined> => {
        try {
            const response = await service.createMessage(message, draft ? 1 : 0);
            return response.data.mensaje;
        } catch (error) {
            console.log(error);
            dispatch(addToast(handleSpikyServiceToast(error, 'Error creando idea.')));
        }
        return undefined;
    };

    const updateDraft = async (
        message: string,
        id: number,
        post: boolean
    ): Promise<Message | undefined> => {
        try {
            const response = await service.updateDraft(message, id, post);
            return response.data.mensaje;
        } catch (error) {
            console.log(error);
            dispatch(addToast(handleSpikyServiceToast(error, 'Error actualizando borrador.')));
        }
        return undefined;
    };

    const createReactionMsg = async (
        messageId: number,
        reaction: string[0],
        uid: number
    ): Promise<boolean> => {
        try {
            await service.createReactionMsg(uid, messageId, reaction);
            return true;
        } catch (error) {
            console.log(error);
            dispatch(addToast(handleSpikyServiceToast(error, 'Error creando reacción.')));
        }
        return false;
    };

    const deleteIdea = async (messageId: number): Promise<boolean> => {
        try {
            await service.deleteMessage(messageId);
            return true;
        } catch (error) {
            console.log(error);
            dispatch(addToast(handleSpikyServiceToast(error, 'Error eliminando idea.')));
        }
        return false;
    };

    const updateNotifications = async (arrayIds: number[]): Promise<boolean> => {
        try {
            await service.updateNotifications(arrayIds);
            return true;
        } catch (error) {
            console.log(error);
            dispatch(
                addToast(handleSpikyServiceToast(error, 'Error actualizando notificaciones.'))
            );
        }
        return false;
    };

    const retrieveNotifications = async (): Promise<Notification[]> => {
        try {
            const response = await service.getNotifications();
            return response.data.notificaciones;
        } catch (error) {
            console.log(error);
            dispatch(addToast(handleSpikyServiceToast(error, 'Error al obtener notificaciones.')));
        }
        return [];
    };

    const createReactionToComment = async (
        commentId: number,
        reactionTypeAux: number
    ): Promise<boolean> => {
        try {
            await service.createReactionCmt(commentId, reactionTypeAux);
            return true;
        } catch (error) {
            console.log(error);
            dispatch(addToast(handleSpikyServiceToast(error, 'Error creando reacción.')));
        }
        return false;
    };

    const getUsersSuggestions = async (word: string): Promise<UserI[]> => {
        try {
            const response = await service.getUserSuggestions(word);
            return response.data.usuarios;
        } catch (error) {
            console.log(error);
            dispatch(
                addToast(handleSpikyServiceToast(error, 'Error obteniendo sugerencia de usuarios.'))
            );
        }
        return [];
    };

    const getHashtagsSuggestions = async (word: string): Promise<HashtagI[]> => {
        try {
            const response = await service.getHashtagsSuggestions(word);
            return response.data.hashtags;
        } catch (error) {
            console.log(error);
            dispatch(
                addToast(handleSpikyServiceToast(error, 'Error obteniendo sugerencia de hashtags.'))
            );
        }
        return [];
    };

    const getIdeaWithComments = async (messageId: number): Promise<Message | undefined> => {
        try {
            const response = await service.getMessageAndComments(messageId);
            return { ...response.data.mensaje, num_respuestas: response.data.num_respuestas };
        } catch (error) {
            console.log(error);
            dispatch(
                addToast(handleSpikyServiceToast(error, 'Error obteniendo idea con comentarios.'))
            );
        }
    };

    const getUserInfo = async (): Promise<{ userInfo?: UserInfo; networkError?: boolean }> => {
        try {
            const response = await service.getUserInfo();
            return { userInfo: response.data.usuario };
        } catch (error) {
            console.log(error);
            if (error instanceof AxiosError) {
                if (error.message === 'Network Error' || error.message.startsWith('timeout')) {
                    return { networkError: true };
                } else {
                    dispatch(
                        addToast(handleSpikyServiceToast(error, 'Error cargando información.'))
                    );
                }
            } else {
                dispatch(addToast(handleSpikyServiceToast(error, 'Error cargando información.')));
            }
        }
        return {};
    };

    const updatePassword = async (
        uid: number,
        currentPassword: string,
        newPassword: string
    ): Promise<boolean> => {
        try {
            await service.updatePassword(uid, currentPassword, newPassword);
            return true;
        } catch (error) {
            console.log(error);
            dispatch(addToast(handleSpikyServiceToast(error, 'Error actualizando contraseña.')));
        }
        return false;
    };

    const updatePasswordUri = async (
        tokenEmail: string,
        correoValid: string,
        newPassword: string
    ): Promise<boolean> => {
        try {
            await service.updatePasswordUri(tokenEmail, correoValid, newPassword);
            return true;
        } catch (error) {
            console.log('[ERROR] no email sent in route params.');
            dispatch(addToast(handleSpikyServiceToast(error, 'Error actualizando contraseña.')));
        }
        return false;
    };

    const getIdeas = async (
        uid: number,
        filter: string,
        lastMessageId: number | undefined,
        parameters: MessageRequestData
    ): Promise<{ messages: Message[]; networkError?: boolean }> => {
        try {
            const response = await service.getMessages(uid, filter, lastMessageId, parameters);
            return { messages: response.data.mensajes };
        } catch (error) {
            console.log(error);
            if (error instanceof AxiosError) {
                if (error.message === 'Network Error' || error.message.startsWith('timeout')) {
                    return { messages: [], networkError: true };
                } else {
                    dispatch(addToast(handleSpikyServiceToast(error, 'Error cargando ideas.')));
                }
            } else {
                dispatch(addToast(handleSpikyServiceToast(error, 'Error cargando ideas.')));
            }
        }
        return { messages: [] };
    };

    const getEmailVerification = async (email: string): Promise<string | undefined> => {
        try {
            const response = await service.getEmailVerification(email);
            return response.data.msg;
        } catch (error) {
            console.log(error);
            dispatch(
                addToast(handleSpikyServiceToast(error, 'Correo invalido, ingrese otro correo.'))
            );
        }
        return undefined;
    };

    const getIdeaReactiones = async (messageId: number): Promise<Reaction[]> => {
        try {
            const response = await service.getIdeaReactions(messageId);
            return response.data.reacciones;
        } catch (error) {
            console.log(error);
            dispatch(addToast(handleSpikyServiceToast(error, 'Error cargando reacciones.')));
        }
        return [];
    };

    const getTermsAndConditions = async (): Promise<{
        termsAndConditions?: TermsAndConditions;
        networkError?: boolean;
    }> => {
        try {
            const response = await service.getTermsAndConditions();
            return { termsAndConditions: response.data.lists };
        } catch (error) {
            console.log(error);
            if (error instanceof AxiosError) {
                if (error.message === 'Network Error' || error.message.startsWith('timeout')) {
                    return { networkError: true };
                } else {
                    dispatch(
                        addToast(handleSpikyServiceToast(error, 'Error cargando información.'))
                    );
                }
            } else {
                dispatch(addToast(handleSpikyServiceToast(error, 'Error cargando información.')));
            }
        }
        return {};
    };

    const registerUser = async (
        sentToken: string,
        newUserAlias: string,
        newUserEmail: string,
        password: string
    ): Promise<{ ok: boolean }> => {
        try {
            const response = await service.registerUser(
                sentToken,
                newUserAlias,
                newUserEmail,
                password
            );
            return response.data;
        } catch (error) {
            console.log(error);
            dispatch(addToast(handleSpikyServiceToast(error, 'Error al crear cuenta.')));
            return { ok: false };
        }
    };
    const logInUser = async (
        correoValid: string,
        password: string,
        deviceTokenStorage: string
    ): Promise<string | undefined> => {
        try {
            const response = await service.login(correoValid, password, deviceTokenStorage);
            const { data } = response;
            const { alias, n_notificaciones, id_universidad, uid, n_chatmensajes } = response.data;
            await AsyncStorage.setItem(StorageKeys.TOKEN, data.token);
            dispatch(updateServiceConfig({ headers: { 'x-token': data.token } }));
            dispatch(signIn(data.token));
            dispatch(
                setUser({
                    nickname: alias,
                    notificationsNumber: n_notificaciones,
                    newChatMessagesNumber: n_chatmensajes,
                    universityId: id_universidad,
                    id: uid,
                })
            );
            return undefined;
        } catch (error) {
            console.log(error);
            dispatch(addToast(handleSpikyServiceToast(error, 'Error al hacer auto-login.')));
        }
        return undefined;
    };

    const getPendingNotifications = async (): Promise<PendingNotificationsI | undefined> => {
        try {
            const response = await service.getPendingNotifications();
            return response.data.pendingNotifications;
        } catch (error) {
            console.log(error);
            dispatch(
                addToast(
                    handleSpikyServiceToast(error, 'Error al obtener notificaciones pendientes.')
                )
            );
        }
        return undefined;
    };

    const handleForgotPassword = async (email: string): Promise<string | undefined> => {
        try {
            const response = await service.handleForgotPassword(email);
            return response.data.msg;
        } catch (error) {
            console.log(error);
            dispatch(addToast(handleSpikyServiceToast(error, 'Error enviado el correo.')));
        }
        return undefined;
    };

    const setSessionInfo = async () => {
        try {
            const response = await service.getUniversities();
            return response.data.universidades;
        } catch (error) {
            console.log(error);
            dispatch(addToast(handleSpikyServiceToast(error, 'Error cargando universidades.')));
        }
    };

    const validateToken = async (tokenStorage: string) => {
        try {
            const response = await service.getAuthRenew(tokenStorage);
            return response.data;
        } catch {
            logOutFunction();
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
        getUserInfo,
        updatePassword,
        updatePasswordUri,
        getIdeas,
        getEmailVerification,
        getIdeaReactiones,
        getTermsAndConditions,
        getPendingNotifications,
        handleForgotPassword,
        registerUser,
        validateToken,
        logOutFunction,
        setSessionInfo,
        logInUser,
    };
}

export default useSpikyService;
