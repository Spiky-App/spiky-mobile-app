import { IdeaType, TopicQuestion, User } from '../../types/store';

export interface LoginResponseData {
    ok: boolean;
    uid: number;
    alias: string;
    id_universidad: string;
    n_notificaciones: number;
    token: string;
}
export interface Universidad {
    id_universidad: number;
    alias: string;
    color: string;
    background_color: string;
}
export interface UniversitiesResponseData {
    ok: boolean;
    universidades: Universidad[];
}
interface Usuario {
    alias: string;
    id_universidad: number;
}

interface Reaccion {
    tipo: number;
}

interface Tracking {
    id_tracking: number;
}

export interface MessagesData {
    id_usuario: number;
    id_mensaje: number;
    mensaje: string;
    fecha: string;
    contra: number;
    favor: number;
    reacciones: Reaccion[];
    trackings: Tracking[];
    num_respuestas: number;
    usuario: Usuario;
    type: number;
}

export interface MessagesResponseData {
    mensajes: MessagesData[];
    ok: boolean;
}

export interface AuthRenewResponseData {
    ok: boolean;
    token: string;
    uid: number;
    alias: string;
    id_universidad: number;
    n_notificaciones: number;
    msg: string;
}
//RAUL
export interface MessageRequestData {
    alias?: string;
    search?: string;
    hashtag?: string;
    univers?: string;
    draft?: number;
    cantidad?: number;
    topicQuestion?: TopicQuestion;
    idea?: {
        id: number;
        message: string;
        user: User;
        date: number;
        type: IdeaType;
    };
}
