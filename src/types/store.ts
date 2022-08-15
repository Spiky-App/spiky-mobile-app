import { StatusType } from './common';

export interface University {
    id?: number;
    shortname: string;
}

export interface User {
    id: number;
    nickname: string;
    university: University;
}
interface Response {
    fecha: string;
    id_mensaje: number;
    id_respuesta: number;
    id_usuario: number;
    respuesta: string;
    usuario: User;
}

export interface ActiveMessage {
    id_mensaje: string;
    mensaje: string;
    fecha: string;
    favor: number;
    contra: number;
    neutro: number;
    id_usuario: string;
    reacciones?: number;
    trackings?: number;
    respuestas: Response[];
    usuario: User;
    num_respuestas: number;
    banned: number;
}

export interface Reaction {
    type: number;
}

export interface Tracking {
    id: number;
}

export interface Message {
    id: number;
    message: string;
    date: number;
    favor: number;
    neutral: number;
    against: number;
    user: User;
    reactions: Reaction[];
    trackings: Tracking[];
    answersNumber: number;
    draft: number;
}

export interface Toast {
    message: string;
    type?: StatusType;
}
