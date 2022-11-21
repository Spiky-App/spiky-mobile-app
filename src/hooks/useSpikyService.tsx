import { useCallback, useEffect, useState } from 'react';
import SpikyService from '../services/SpikyService';
import { RootState } from '../store';
import { addToast } from '../store/feature/toast/toastSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { StatusType } from '../types/common';
import { Toast } from '../types/store';
import { removeUser } from '../store/feature/user/userSlice';
import { signOut } from '../store/feature/auth/authSlice';
import { restartConfig } from '../store/feature/serviceConfig/serviceConfigSlice';
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
} from '../types/services/spiky';

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

    function handleSpikyServiceToast(error: unknown, defaultMessage: string): Toast {
        console.log('error', error, 'message: ', defaultMessage);

        if (error instanceof AxiosError) {
            return {
                message: error.response?.data?.message,
                type: StatusType.WARNING,
            };
        }
        return {
            message: defaultMessage,
            type: StatusType.WARNING,
        };
    }

    const createMessageComment = useCallback(
        async (
            messageId: number,
            uid: number,
            comment: string
        ): Promise<MessageComment | undefined> => {
            try {
                const response = await service.createMessageComment(messageId, uid, comment);
                return response.data.respuesta;
            } catch (error) {
                dispatch(addToast(handleSpikyServiceToast(error, 'Error creando respuesta.')));
            }
            return undefined;
        },
        [service]
    );

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
            dispatch(addToast(handleSpikyServiceToast(error, 'Error siguiendo mensaje.')));
        }
        return undefined;
    };

    const deleteTracking = async (messageId: number): Promise<boolean> => {
        try {
            await service.deleteTracking(messageId);
            return true;
        } catch (error) {
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
            dispatch(addToast(handleSpikyServiceToast(error, 'Error al crear mensaje.')));
        }
        return undefined;
    };

    const getConversations = async (): Promise<Conversation[]> => {
        try {
            const response = await service.getConversations();
            return response.data.convers;
        } catch (error) {
            console.log(error);
            dispatch(addToast(handleSpikyServiceToast(error, 'Error al listar conversaciones.')));
        }
        return [];
    };

    const getChatMessages = async (
        conversationId: number,
        lastChatMessageId?: number
    ): Promise<GetChatMessages | undefined> => {
        try {
            const response = await service.getChatMessages(conversationId, lastChatMessageId);
            return response.data;
        } catch (error) {
            console.log(error);
            dispatch(addToast(handleSpikyServiceToast(error, 'Error al cargar los mensajes.')));
        }
        return undefined;
    };

    const createChatMessage = async (
        conversationId: number,
        chatMessage: string
    ): Promise<ChatMessage | undefined> => {
        try {
            const response = await service.createChatMessage(conversationId, chatMessage);
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
            dispatch(addToast(handleSpikyServiceToast(error, 'Error eliminando idea.')));
        }
        return false;
    };

    const updateNotifications = async (arrayIds: number[]): Promise<boolean> => {
        try {
            await service.updateNotifications(arrayIds);
            return true;
        } catch (error) {
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
            dispatch(
                addToast(handleSpikyServiceToast(error, 'Error obteniendo idea con comentarios.'))
            );
        }
    };

    const loadUserInfo = async (): Promise<UserI | undefined> => {
        try {
            const response = await service.getUserInfo();
            return response.data.usuario;
        } catch (error) {
            dispatch(
                addToast(handleSpikyServiceToast(error, 'Error cargando información del usuario.'))
            );
        }
        return undefined;
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
    ): Promise<Message[]> => {
        try {
            const response = await service.getMessages(uid, filter, lastMessageId, parameters);
            return response.data.mensajes;
        } catch (error) {
            console.log(error);
            dispatch(addToast(handleSpikyServiceToast(error, 'Error cargando mensajes.')));
        }
        return [];
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

    const getTermsAndConditions = async (): Promise<TermsAndConditions | undefined> => {
        try {
            const response = await service.getTermsAndConditions();
            return response.data.lists;
        } catch (error) {
            dispatch(addToast(handleSpikyServiceToast(error, 'Error cargando reacciones.')));
        }
        return undefined;
    };

    const registerUser = async (
        sentToken: string,
        newUserAlias: string,
        newUserEmail: string,
        password: string
    ): Promise<string | undefined> => {
        try {
            const response = await service.registerUser(
                sentToken,
                newUserAlias,
                newUserEmail,
                password
            );
            return response.data.msg;
        } catch (error) {
            console.log(error);
            dispatch(addToast(handleSpikyServiceToast(error, 'Error al crear cuenta.')));
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
        getTermsAndConditions,
        getPendingNotifications,
        handleForgotPassword,
        registerUser,
    };
}

export default useSpikyService;
