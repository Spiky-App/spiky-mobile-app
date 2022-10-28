export interface LoginResponse {
    ok: boolean;
    uid: number;
    alias: string;
    id_universidad: number;
    n_notificaciones: number;
    n_chatmensajes: number;
    token: string;
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

export interface MessageRequestParams {
    alias?: string;
    search?: string;
    hashtag?: string;
    univer?: number;
    draft?: boolean;
    lastMessageId?: number;
}

export interface GetMessagesResponse {
    ok: boolean;
    mensajes: Message[];
}

export interface Message {
    banned?: number;
    draft: number;
    fecha: string | number;
    id_mensaje: number;
    id_usuario: number;
    mensaje: string;
    num_respuestas?: number;
    reacciones: ReactionCount[];
    mi_reaccion?: string;
    trackings?: [{ id_tracking: number }];
    usuario: User;
    respuestas?: Comment[];
}

interface User {
    alias: string;
    id_universidad: number;
    id_usuario?: number;
    online?: boolean;
}

interface ReactionCount {
    reaccion: string;
    count: number;
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
    usuarios: User[];
}

interface Hashtag {
    id_hashtag: number;
    hashtag: string;
}

export interface GetHashtagsSuggetionProps {
    ok: boolean;
    hashtags: Hashtag[];
}

export interface CreateTrackingProps {
    ok: boolean;
    id_tracking: number;
}

export interface DeleteTrackingProps {
    ok: boolean;
}

export interface CreateReactionMsg {
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
    id_usuario: number;
    resp_reaccion_1: number | null;
    resp_reaccion_2: number | null;
    usuario: User;
    resp_reacciones: {
        tipo: number;
    }[];
}

export interface CreateReactionCmt {
    ok: boolean;
}

export interface GetNotifications {
    ok: boolean;
    notificaciones: Notification[];
}

export interface Notification {
    id_notificacion: number;
    id_mensaje: number;
    tipo: number;
    visto: boolean;
    updatedAt: string | null;
    createdAt: string;
    usuario2: User;
    mensaje: {
        mensaje: string;
    };
}

export interface UpdateNotifications {
    ok: boolean;
}

export interface GetUserInfo {
    ok: boolean;
    usuario: UsuariorData;
}

export interface UsuariorData {
    correo: string;
    universidad: string;
}

export interface UpdatePassword {
    ok: boolean;
}

export interface CreateMessageCommentResponse {
    ok: boolean;
    respuesta: MessageComment;
}

interface MessageComment {
    id_respuesta: number;
    respuesta: string;
    id_mensaje: number;
    id_usuario: number;
    fecha: number;
    usuario?: User;
}

export interface CreateReportIdea {
    ok: boolean;
    msg: string;
}

export interface CreateChatMsgWithReply {
    ok: boolean;
    content: {
        userto: number;
        conver: Conversation;
        newConver: boolean;
    };
}

export interface GetConversations {
    ok: boolean;
    convers: Conversation[];
}

export interface Conversation {
    id_conversacion: number;
    usuario1: User;
    usuario2: User;
    chatmensajes: ChatMessage;
}

export interface GetChatMessages {
    ok: boolean;
    chatmensajes: ChatMessage[];
    n_chatmensajes_unseens: number;
}

export interface ChatMessage {
    id_chatmensaje: number;
    id_conversacion: number;
    id_usuario: number;
    chatmensaje: string;
    fecha: string;
    mensaje?: ReplyMessage;
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
    usuario: User;
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

export interface Reaction {
    id_reaccion: number;
    reaccion: string;
    usuario: User;
}

export interface GetPendingNotifications {
    ok: boolean;
    pendingNotifications: {
        newChatMessagesNumber: number;
        notificationsNumber: number;
    };
}
