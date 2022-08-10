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

export interface MessagesResponse {
    ok: boolean;
    mensajes: Message[];
}

interface Message {
    id_mensaje: number;
    mensaje: string;
    fecha: string;
    favor: number;
    neutro: number;
    contra: number;
    id_usuario: number;
    usuario: User;
    reacciones: [{ tipo: number }];
    trackings: [{ id_tracking: number }];
    num_respuestas: number;
    draft: number;
}

interface User {
    alias: string;
    id_universidad: number;
    universidad: University;
}
