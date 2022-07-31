export interface University {
    id: number;
    shortname: string;
}

export interface User {
    alias: string;
    university: University;
}

export interface Message {
    id: number;
    message: string;
    date: string;
    favor: number;
    neutral: number;
    aggainst: number;
    user: User;
    reactions: [];
    trackings: [],
    answersNumber: number;
    draft: number;
}