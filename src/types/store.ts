import { StatusType } from './common';

export interface University {
    id: number;
    shortname: string;
}

export interface User {
    id: number;
    alias: string;
    university: University;
}

export interface Message {
    id: number;
    message: string;
    date: string;
    favor: number;
    neutral: number;
    against: number;
    user: User;
    reaction_type?: number;
    id_tracking?: number;
    answersNumber: number;
    draft: number;
}

export interface Toast {
    message: string;
    type?: StatusType;
}
