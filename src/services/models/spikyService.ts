export interface LoginResponseData {
  ok: boolean;
  uid: number;
  alias: string;
  universidad: string;
  n_notificaciones: number;
  token: string;
}

interface Universidad {
  id_universidad: number;
  alias?: string;
}
export interface UniversitiesResponseData {
  ok: boolean;
  universidades: Universidad[];
}
interface Usuario {
  alias: string;
  id_universidad: number;
  universidad: Universidad;
}

interface Reaccion {
  tipo: number;
}

interface Tracking {
  id_tracking: number;
}

interface MessagesData {
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
  draft: number;
}
export interface MessagesResponseData {
  mensajes: MessagesData[];
  ok: boolean;
}