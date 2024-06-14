import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
    LoginResponse,
    GetMessagesResponse,
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
    CreateReport,
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
    UpdateUserNickname,
    DeleteAccount,
    GetX2Reactions,
    UpdateMood,
    GetMoodHistory,
    GetSessionInfo,
    GetRandomTopicQuestion,
    GetTopicQuestions,
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

    getSessionInfo() {
        return this.instance.get<GetSessionInfo>('lists/session-info');
    }

    getMessages(filter: string, lastMessageId: number | undefined, parameters: MessageRequestData) {
        const params = {
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

    createMessage(
        message: string,
        type: number = 1,
        childMessageId?: number,
        isSuperAnonymous?: boolean,
        topicQuestionId?: number
    ) {
        return this.instance.post<CreateMessageResponse>('mensajes/create', {
            mensaje: message,
            type,
            id_mensaje_child: childMessageId,
            anonymous: isSuperAnonymous,
            id_topic_question: topicQuestionId,
        });
    }
    updateDraft(message: string, id: number, post: boolean) {
        return this.instance.put<UpdateDraftResponse>('mensajes/draft/update', {
            id_mensaje: id,
            mensaje: message,
            post,
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
    blockUser(uid: number, blocked_user: string, remove: boolean) {
        return this.instance.post(`report/block-user`, { uid, blocked_user, remove });
    }
    getBlockedUsers(uid: number) {
        return this.instance.post(`report/get-blocked-users`, { uid });
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

    createMessageComment(messageId: number, uid: number, comment: string, anonymous: boolean) {
        return this.instance.post<CreateMessageCommentResponse>('/resp', {
            id_mensaje: messageId,
            uid,
            respuesta: comment,
            anonymous,
        });
    }

    createReport(
        reportReason: string,
        messageId?: number,
        reportedUser?: string,
        updatePreferences?: boolean
    ) {
        return this.instance.post<CreateReport>(`report`, {
            id_mensaje: messageId,
            usuario_reportado: reportedUser,
            motivo_reporte: reportReason,
            update_preferences: updatePreferences,
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

    logout(deviceTokenStorage: string, sessionId: number) {
        return this.instance.post<DeleteDeviceToken>(`auth/logout`, {
            device_token: deviceTokenStorage,
            sessionId,
        });
    }

    getNetworkConnectionStatus() {
        return this.instance.get<GetNetworkConnectionStatus>(`verif/net-connection`);
    }

    getCommentReactions(commentId: number) {
        return this.instance.get<GetCommentReactions>(`reacc/resp/${commentId}`);
    }

    createPoll(message: string, answers: string[], isSuperAnonymous: boolean) {
        return this.instance.post<CreatePollResponse>('mensajes/create-poll', {
            mensaje: message,
            opciones: answers,
            anonymous: isSuperAnonymous,
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

    updateUserNickname(nickname: string) {
        return this.instance.put<UpdateUserNickname>(`auth/alias`, {
            alias: nickname,
        });
    }

    deleteAccount() {
        return this.instance.put<DeleteAccount>(`auth/delete-account`);
    }

    getX2Reactions(messageId: number) {
        return this.instance.get<GetX2Reactions>(`reacc/x2/${messageId}`);
    }

    updateMood(emoji: string, mood: string) {
        return this.instance.put<UpdateMood>('mensajes/mood', {
            emoji,
            mood,
        });
    }

    getMoodHistory() {
        return this.instance.get<GetMoodHistory>('mensajes/moods');
    }

    getRandomTopicQuestion(topicId: number) {
        return this.instance.get<GetRandomTopicQuestion>('topic/random-questions/' + topicId);
    }

    getTopicQuestions(topicId?: number) {
        const params = { id_topic: topicId };
        return this.instance.get<GetTopicQuestions>('topic/questions', { params });
    }
}

export default SpikyService;
