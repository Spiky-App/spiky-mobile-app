import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
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

export enum ReactionType {
    NEUTRAL = 0,
    FAVOR = 1,
    AGAINST = 2,
}

export interface Message {
    id: number;
    message: string;
    date: number;
    favor: number;
    neutral: number;
    against: number;
    user: User;
    reactionType?: ReactionType;
    messageTrackingId?: number;
    answersNumber: number;
    draft: number;
    sequence: number;
}

export interface Toast {
    message: string;
    type?: StatusType;
}

export interface ModalAlert {
    isOpen: boolean;
    text?: string;
    icon?: IconDefinition;
    color?: string;
}

export interface MessageComment {
    comment: string;
    date: number;
    id: number;
    messageId: number;
    user: User;
}
