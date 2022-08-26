export interface LoginResponse {
    ok: boolean;
    uid: number;
    alias: string;
    universidad: string;
    n_notificaciones: number;
    token: string;
}

export interface UniversityResponse {
    ok: boolean;
    universidades: University[];
}

interface University {
    id_universidad?: number;
    alias: string;
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
    contra: number;
    draft: number;
    favor: number;
    fecha: string | number;
    id_mensaje: number;
    id_usuario: number;
    mensaje: string;
    neutro: number;
    num_respuestas?: number;
    reacciones?: [{ tipo: number }];
    trackings?: [{ id_tracking: number }];
    usuario: User;
}

interface User {
    alias: string;
    id_universidad?: number;
    universidad: University;
    id_usuario?: number;
}

export interface CreateMessageResponse {
    ok: boolean;
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
