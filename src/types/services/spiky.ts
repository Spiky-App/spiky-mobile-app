export interface LoginResponse {
    ok: boolean;
    uid: number;
    alias: string;
    id_universidad: number;
    n_notificaciones: number;
    n_chatmensajes: number;
    token: string;
}

export interface RegisterUser {
    ok: boolean;
    uid: number;
    alias: string;
    id_universidad: number;
    token: string;
    msg: string;
}

export interface ForgotPasswordResponse {
    ok: boolean;
    msg: string;
}

export interface UniversityResponse {
    ok: boolean;
    universidades: University[];
}

interface University {
    id_universidad: number;
    alias: string;
    color: string;
    background_color: string;
}

export interface GetMessagesResponse {
    ok: boolean;
    mensajes: Message[];
    mood: string | undefined;
}

export interface Message {
    banned?: number;
    type: number;
    fecha: string | number;
    id_mensaje: number;
    id_usuario: number;
    mensaje: string;
    num_respuestas: number;
    num_x2?: number;
    mi_x2: boolean;
    reacciones: ReactionCount[];
    mi_reaccion?: string;
    trackings?: [{ id_tracking: number }];
    usuario: UserI;
    respuestas?: Comment[];
    encuesta_opciones: AnswerCount[];
    mi_encuesta_respuesta?: number;
    total_encuesta_respuestas: number;
    mensaje_child?: ChildMessage;
    anonymous: boolean;
}

export interface ChildMessage {
    banned?: number;
    type: number;
    fecha: string | number;
    id_mensaje: number;
    id_usuario: number;
    mensaje: string;
    num_respuestas?: number;
    num_x2?: number;
    mi_x2: boolean;
    reacciones: ReactionCount[];
    mi_reaccion?: string;
    trackings?: [{ id_tracking: number }];
    usuario: UserI;
    respuestas?: Comment[];
    encuesta_opciones: AnswerCount[];
    mi_encuesta_respuesta?: number;
    total_encuesta_respuestas: number;
    anonymous: boolean;
}

export interface UserI {
    alias: string;
    id_universidad: number;
    id_usuario?: number;
    online?: boolean;
    disable?: boolean;
}

export interface ReactionCount {
    reaccion: string;
    count: number;
}

export interface AnswerCount {
    id_encuesta_opcion: number;
    encuesta_opcion: string;
    encuesta_respuestas_count: number;
}

export interface CreateMessageResponse {
    ok: boolean;
    mensaje: Message;
}

export interface UpdateDraftResponse {
    ok: boolean;
    msg: string;
    mensaje: Message;
}

export interface GetUsersSuggetionProps {
    ok: boolean;
    usuarios: UserI[];
}

export interface HashtagI {
    id_hashtag: number;
    hashtag: string;
}

export interface GetHashtagsSuggetionProps {
    ok: boolean;
    hashtags: HashtagI[];
}

export interface CreateTrackingProps {
    ok: boolean;
    id_tracking: number;
}

export interface DeleteTrackingProps {
    ok: boolean;
}

export interface CreateIdeaReaction {
    ok: boolean;
}

export interface DeleteMessageProps {
    ok: boolean;
    msg: string;
}

export interface GetMessageAndComments {
    ok: boolean;
    mensaje: Message;
    num_respuestas: number;
}

export interface Comment {
    id_respuesta: number;
    respuesta: string;
    fecha: string | number;
    id_mensaje: number;
    resp_reacciones: ReactionCount[];
    usuario: UserI;
    mi_resp_reaccion?: string;
    anonymous: boolean;
}

export interface CreateCommentReaction {
    ok: boolean;
}

export interface GetNotifications {
    ok: boolean;
    notificaciones: Notification[];
}

export interface Notification {
    id_notificacion: number;
    id_mensaje: number;
    id_respuesta: number | null;
    tipo: number;
    visto: boolean;
    updatedAt: string | null;
    createdAt: string;
    usuario2: UserI;
    mensaje: {
        mensaje: string;
    };
    respuesta: {
        respuesta: string;
    } | null;
}

export interface UpdateNotifications {
    ok: boolean;
}

export interface GetUserInfo {
    ok: boolean;
    usuario: UserInfo;
    change_alias?: boolean;
}

export interface UserInfo {
    correo: string;
    universidad: string;
}

export interface UpdatePassword {
    ok: boolean;
}

export interface UpdatePasswordUri {
    ok: boolean;
}

export interface CreateMessageCommentResponse {
    ok: boolean;
    respuesta: MessageComment;
}

export interface MessageComment {
    id_respuesta: number;
    respuesta: string;
    id_mensaje: number;
    id_usuario: number;
    fecha: number;
    usuario?: UserI;
}

export interface CreateReport {
    ok: boolean;
    msg: string;
}

export interface CreateChatMsgWithReply {
    ok: boolean;
    content: MessageWithReplyContent;
}

export interface MessageWithReplyContent {
    userto: number;
    conver: Conversation;
    newConver: boolean;
}

export interface GetConversations {
    ok: boolean;
    convers: Conversation[];
}

export interface Conversation {
    id_conversacion: number;
    usuario1: UserI;
    usuario2: UserI;
    chatmensajes: ChatMessage;
}

export interface GetChatMessages {
    ok: boolean;
    chatmensajes: ChatMessage[];
    n_chatmensajes_unseens: number;
    toUserIsOnline: boolean;
}

export interface ChatMessage {
    id_chatmensaje: number;
    id_conversacion: number;
    id_usuario: number;
    chatmensaje: string;
    fecha: string;
    mensaje?: ReplyMessage;
    reply?: Reply;
    seens: Seen[];
}

export interface Seen {
    id_usuario: number;
    fecha: string;
    id_conversacion?: number;
    id_chatmensaje?: number;
}

interface ReplyMessage {
    id_mensaje: number;
    mensaje: string;
    usuario: UserI;
}

interface Reply {
    chatmensaje: {
        id_chatmensaje: number;
        chatmensaje: string;
        usuario: UserI;
    };
}

export interface CreateChatMessage {
    ok: boolean;
    chatmensaje: ChatMessage;
    userto: number;
}

export interface CreateChatMessageSeen {
    ok: boolean;
    content: {
        chatmsg_seen: Seen;
        userto: number;
    };
}

export interface GetEmailVerification {
    ok: boolean;
    msg: string;
}

export interface GetIdeaReactions {
    ok: boolean;
    reacciones: Reaction[];
}

export interface GetCommentReactions {
    ok: boolean;
    reacciones: CommentReaction[];
}

export interface Reaction {
    id_reaccion: number;
    reaccion: string;
    usuario: UserI;
}

export interface CommentReaction {
    id_resp_reaccion: number;
    reaccion: string;
    usuario: UserI;
}

export interface GetPendingNotifications {
    ok: boolean;
    pendingNotifications: PendingNotificationsI;
}

export interface PendingNotificationsI {
    newChatMessagesNumber: number;
    notificationsNumber: number;
}

export interface GetTermsAndConditions {
    ok: number;
    lists: TermsAndConditions;
}

export interface TermsAndConditions {
    termsAndConditions: {
        title: string;
        paragraphs: string[];
    }[];
    noticeOfPrivacy: {
        title: string;
        paragraphs: string[];
    }[];
}

export interface DeleteDeviceToken {
    ok: boolean;
    msg: string;
}

export interface GetNetworkConnectionStatus {
    ok: boolean;
}

export interface CreatePollResponse {
    ok: boolean;
    mensaje: Message;
}

export interface CreateAnswerPoll {
    ok: boolean;
}

export interface GetPollAnswers {
    ok: boolean;
    encuesta_opciones: PollAnswer[];
}

export interface PollAnswer {
    id_encuesta_opcion: number;
    encuesta_opcion: string;
    count: number;
    encuesta_respuestas: {
        id_usuario: number;
        usuario: UserI;
    }[];
}

export interface UpdateUserNickname {
    ok: boolean;
    uid: number;
    alias: string;
    id_universidad: number;
    n_notificaciones: number;
    n_chatmensajes: number;
    token: string;
}

export interface DeleteAccount {
    ok: boolean;
}

export interface GetX2Reactions {
    ok: boolean;
    X2s: X2Reaction[];
}

export interface X2Reaction {
    mensaje_parent: {
        id_mensaje: number;
        usuario: UserI;
    };
    row_num: number;
}

export interface UpdateMood {
    ok: boolean;
    mensaje: Message;
}

export interface GetMoodHistory {
    ok: boolean;
    mensajes: Mood[];
}

export interface Mood {
    id_mensaje: number;
    mensaje: string;
    fecha: string;
}
