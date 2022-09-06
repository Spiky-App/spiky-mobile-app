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
    CreateReactionMsg,
    DeleteMessageProps,
    GetNotifications,
    UpdateNotifications,
    GetMessageAndComments,
    CreateReactionCmt,
    UpdateDraftResponse,
    CreateReportIdea,
    GetUserInfo,
    UpdatePassword,
    CreateMessageCommentResponse,
    CreateChatMsgWithReply,
    GetConversations,
} from '../types/services/spiky';
import { MessageRequestData } from '../services/models/spikyService';

class SpikyService {
    private instance: AxiosInstance;

    constructor(config?: AxiosRequestConfig) {
        this.instance = axios.create(config);
    }

    login(email: string, password: string) {
        return this.instance.post<LoginResponse>('auth/login', {
            contrasena: password,
            correo: email,
        });
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

    createReactionMsg(uid: number, messageId: number, reactionType: number) {
        return this.instance.post<CreateReactionMsg>(`reacc`, {
            uid,
            id_mensaje: messageId,
            tipo: reactionType,
        });
    }

    deleteMessage(messageId: number) {
        return this.instance.post<DeleteMessageProps>(`mensajes/delete`, { id_mensaje: messageId });
    }

    getMessageAndComments(messageId: number) {
        return this.instance.get<GetMessageAndComments>(`mensajes/msg-resps/${messageId}`);
    }

    createReactionCmt(commentId: number, reactionType: number) {
        return this.instance.post<CreateReactionCmt>(`reacc/resp`, {
            id_respuesta: commentId,
            tipo: reactionType,
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

    createChatMsgWithReply(uid: number, userId: number, messageId: number, chatMessage: string) {
        return this.instance.post<CreateChatMsgWithReply>(`conver`, {
            id_usuario1: uid,
            id_usuario2: userId,
            chatmensaje: chatMessage,
            id_mensaje: messageId,
        });
    }

    getConversations() {
        return this.instance.get<GetConversations>(`conver`);
    }
}

export default SpikyService;
