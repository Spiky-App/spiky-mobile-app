import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { StatusType } from './common';

export interface University {
    id: number;
    shortname: string;
    backgroundColor: string;
    color: string;
}

export interface User {
    id?: number;
    nickname: string;
    universityId: number;
    online?: boolean;
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
    user: User;
    myReaction?: string;
    reactions: Reaction[];
    messageTrackingId?: number;
    answersNumber: number;
    draft: number;
    sequence: number;
    comments?: Comment[];
}

export interface Reaction {
    reaction: string;
    count: number;
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

export interface Comment {
    id: number;
    comment: string;
    date: number;
    messageId: number;
    user: User;
    favor: number;
    against: number;
    reactionCommentType?: ReactionType;
}

export interface Notification {
    id: number;
    messageId: number;
    message: string;
    type: NotificationType;
    seen: boolean;
    updatedAt: string | null;
    createdAt: string;
    user: User;
}

export enum NotificationType {
    NOTHING = 0,
    REACT_IDEA = 1,
    COMMENT_IDEA = 2,
    COMMENT_TRACKING = 3,
    MENTION = 4,
    REACT_COMMENT = 5,
}

export interface Conversation {
    id: number;
    user_1: User;
    user_2: User;
    chatmessage: ChatMessage;
}

export interface ChatMessage {
    id: number;
    conversationId: number;
    userId: number;
    message: string;
    date: number;
    replyMessage?: replyMessage;
    seens?: Seen[];
    newMsg: boolean;
}

export interface Seen {
    userId: number;
    date: number;
}

interface replyMessage {
    id: number;
    message: string;
    user: User;
}
