import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
    LoginResponse,
    GetMessagesResponse,
    UniversityResponse,
    MessageRequestParams,
    CreateMessageResponse,
    GetUsersSuggetionProps,
    GetHashtagsSuggetionProps,
    CreateTrackingProps,
    DeleteTrackingProps,
    CreateIdeaReaction,
    DeleteMessageProps,
    GetNotifications,
    UpdateNotifications,
    GetMessageAndComments,
    CreateCommentReaction,
    UpdateDraftResponse,
    CreateReportIdea,
    GetUserInfo,
    UpdatePassword,
    UpdatePasswordUri,
    CreateMessageCommentResponse,
    CreateChatMsgWithReply,
    GetConversations,
    GetChatMessages,
    CreateChatMessage,
    CreateChatMessageSeen,
    GetEmailVerification,
    GetIdeaReactions,
    GetPendingNotifications,
    GetTermsAndConditions,
    ForgotPasswordResponse,
    DeleteDeviceToken,
    RegisterUser,
    GetNetworkConnectionStatus,
    GetCommentReactions,
    CreatePollResponse,
    CreateAnswerPoll,
    GetPollAnswers,
} from '../types/services/spiky';
import { MessageRequestData } from '../services/models/spikyService';
class SpikyService {
    private instance: AxiosInstance;

    constructor(config?: AxiosRequestConfig) {
        this.instance = axios.create(config);
    }
    login(email: string, password: string, deviceTokenStorage: string) {
        return this.instance.post<LoginResponse>('auth/login', {
            contrasena: password,
            correo: email,
            device_token: deviceTokenStorage,
        });
    }

    handleForgotPassword(email: string) {
        return this.instance.get<ForgotPasswordResponse>('auth/forgot-password?correo=' + email);
    }

    getUniversities() {
        return this.instance.get<UniversityResponse>('univer');
    }

    getMessages(
        uid: number,
        filter: string,
        lastMessageId: number | undefined,
        parameters: MessageRequestData
    ) {
        const params = {
            uid: uid,
            id_ultimoMensaje: lastMessageId,
            ...parameters,
        };
        return this.instance.get<GetMessagesResponse>(`mensajes${filter}`, { params });
    }

    getAuthRenew(token: string) {
        return this.instance.get<LoginResponse>('auth/renew', {
            headers: { 'x-token': token },
        });
    }

    createMessage(message: string, draft: number) {
        return this.instance.post<CreateMessageResponse>('mensajes/create', {
            mensaje: message,
            draft,
        });
    }
    updateDraft(message: string, id: number, post: boolean) {
        return this.instance.put<UpdateDraftResponse>('mensajes/draft/update', {
            id_mensaje: id,
            mensaje: message,
            post,
        });
    }

    //Este servicio parece que no lo usan
    getUserMessages(uid: number, parameters?: MessageRequestParams) {
        const params = {
            uid,
            ...parameters,
        };
        return this.instance.get<GetMessagesResponse>(`mensajes/user`, {
            params,
        });
    }

    getUserSuggestions(word: string) {
        return this.instance.get<GetUsersSuggetionProps>(`users/${word}`);
    }

    getHashtagsSuggestions(word: string) {
        return this.instance.get<GetHashtagsSuggetionProps>(`hashtag/${word}`);
    }

    createTracking(uid: number, messageId: number) {
        return this.instance.post<CreateTrackingProps>(`track`, { uid, id_mensaje: messageId });
    }

    deleteTracking(messageTrackingId: number) {
        return this.instance.delete<DeleteTrackingProps>(`track/${messageTrackingId}`);
    }

    createIdeaReaction(uid: number, messageId: number, reaction: string[0]) {
        return this.instance.post<CreateIdeaReaction>(`reacc`, {
            uid,
            id_mensaje: messageId,
            reaccion: reaction,
        });
    }

    deleteMessage(messageId: number) {
        return this.instance.post<DeleteMessageProps>(`mensajes/delete`, { id_mensaje: messageId });
    }

    getMessageAndComments(messageId: number) {
        return this.instance.get<GetMessageAndComments>(`mensajes/msg-resps/${messageId}`);
    }

    createCommentReaction(commentId: number, reaction: string) {
        return this.instance.post<CreateCommentReaction>(`reacc/resp`, {
            id_respuesta: commentId,
            reaccion: reaction,
        });
    }

    getNotifications() {
        return this.instance.get<GetNotifications>(`notif`);
    }

    updateNotifications(arrayIds: number[]) {
        return this.instance.put<UpdateNotifications>(`notif`, { id_notificaciones: arrayIds });
    }

    getUserInfo() {
        return this.instance.get<GetUserInfo>(`auth/info`);
    }

    updatePassword(uid: number, currentPassword: string, newPassword: string) {
        return this.instance.put<UpdatePassword>('auth/change-password', {
            uid,
            actualContrasena: currentPassword,
            nuevaContrasena: newPassword,
        });
    }
    updatePasswordUri(tokenEmail: string, correoValid: string, newPassword: string) {
        let config = {
            headers: {
                'x-token': tokenEmail,
            },
        };
        return this.instance.put<UpdatePasswordUri>(
            'auth/change-password-uri',
            {
                validCorreo: correoValid,
                nuevaContrasena: newPassword,
                keyword: 'FG',
            },
            config
        );
    }

    createMessageComment(messageId: number, uid: number, comment: string) {
        return this.instance.post<CreateMessageCommentResponse>('/resp', {
            id_mensaje: messageId,
            uid,
            respuesta: comment,
        });
    }

    createReportIdea(uid: number, messageId: number, reportReason: string) {
        return this.instance.post<CreateReportIdea>(`report`, {
            id_usuario: uid,
            id_mensaje: messageId,
            motivo_reporte: reportReason,
        });
    }

    createChatMsgWithReply(userId: number, messageId: number, chatMessage: string) {
        return this.instance.post<CreateChatMsgWithReply>(`conver`, {
            id_usuario: userId,
            chatmensaje: chatMessage,
            id_mensaje: messageId,
        });
    }

    getConversations() {
        return this.instance.get<GetConversations>(`conver`);
    }

    getChatMessages(
        conversationId: number,
        toUserId?: number,
        lastChatMessageId?: number,
        firstChatMessageId?: number
    ) {
        const params = {
            conver: conversationId,
            id_ultimoChatmensaje: lastChatMessageId,
            id_primerChatmensaje: firstChatMessageId,
            toUserId,
        };
        return this.instance.get<GetChatMessages>(`conver/chatmsg`, { params });
    }

    createChatMessage(conversationId: number, chatMessage: string, chatMessageRepliedId?: number) {
        return this.instance.post<CreateChatMessage>(`conver/chatmsg`, {
            id_conversacion: conversationId,
            chatmensaje: chatMessage,
            id_chatmensaje: chatMessageRepliedId,
        });
    }

    createChatMessageSeen(chatMessageId: number) {
        return this.instance.post<CreateChatMessageSeen>(`conver/seen`, {
            id_chatmensaje: chatMessageId,
        });
    }

    getEmailVerification(email: string) {
        return this.instance.get<GetEmailVerification>(`verif/verify/${email}`);
    }

    registerUser(token: string, alias: string, email: string, password: string) {
        let config = {
            headers: {
                'x-token': token,
            },
        };
        return this.instance.post<RegisterUser>(
            `auth/register`,
            {
                alias,
                validCorreo: email,
                contrasena: password,
                keyword: 'VC',
            },
            config
        );
    }

    getIdeaReactions(ideaId: number) {
        return this.instance.get<GetIdeaReactions>(`reacc/${ideaId}`);
    }

    getPendingNotifications() {
        return this.instance.get<GetPendingNotifications>(`auth/pending-notif`);
    }

    getTermsAndConditions() {
        return this.instance.get<GetTermsAndConditions>(`lists/terms`);
    }

    deleteDeviceToken(deviceTokenStorage: string) {
        return this.instance.post<DeleteDeviceToken>(`auth/logout`, {
            device_token: deviceTokenStorage,
        });
    }

    getNetworkConnectionStatus() {
        return this.instance.get<GetNetworkConnectionStatus>(`verif/net-connection`);
    }

    getCommentReactions(commentId: number) {
        return this.instance.get<GetCommentReactions>(`reacc/resp/${commentId}`);
    }

    createPoll(message: string, answers: string[]) {
        return this.instance.post<CreatePollResponse>('mensajes/create-poll', {
            mensaje: message,
            opciones: answers,
        });
    }

    createPollAnswer(answerId: number) {
        return this.instance.post<CreateAnswerPoll>('poll/answer', {
            id_encuesta_opcion: answerId,
        });
    }

    getPollAnswers(messageId: number) {
        return this.instance.get<GetPollAnswers>(`poll/answers/${messageId}`);
    }
}

export default SpikyService;
