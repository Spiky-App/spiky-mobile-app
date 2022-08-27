import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
    LoginResponse,
    GetMessagesResponse,
    UniversityResponse,
    MessageRequestParams,
    CreateMessageResponse,
    GetUsersSuggetionProps,
    GetHashtagsSuggetionProps,
    CreateTrackingProps,
    DeleteTrackingProps,
    CreateReactionMsg,
} from '../types/services/spiky';
import { MessageRequestData } from '../services/models/spikyService';

class SpikyService {
    private instance: AxiosInstance;

    constructor(config?: AxiosRequestConfig) {
        this.instance = axios.create(config);
    }

    login(email: string, password: string) {
        return this.instance.post<LoginResponse>('auth/login', {
            contrasena: password,
            correo: email,
        });
    }

    getUniversities() {
        return this.instance.get<UniversityResponse>('univer');
    }

    getMessages(
        uid: number,
        lastMessageId: number | undefined,
        filter: string,
        parameters: MessageRequestData
    ) {
        const defaultParams: MessageRequestData = {
            cantidad: 15,
        };
        const params = {
            uid: uid,
            id_ultimoMensaje: lastMessageId,
            ...defaultParams,
            ...parameters,
        };
        return this.instance.get<GetMessagesResponse>(`mensajes${filter}`, {
            params,
        });
    }

    getAuthRenew(token: string) {
        return this.instance.get<LoginResponse>('auth/renew', {
            headers: { 'x-token': token },
        });
    }

    createMessage(message: string, draft: number) {
        return this.instance.post<CreateMessageResponse>('mensajes/create', {
            mensaje: message,
            draft,
        });
    }

    getUserMessages(uid: number, parameters?: MessageRequestParams) {
        const params = {
            uid,
            ...parameters,
        };
        return this.instance.get<GetMessagesResponse>(`mensajes/user`, {
            params,
        });
    }

    getUserSuggestions(word: string) {
        return this.instance.get<GetUsersSuggetionProps>(`users/${word}`);
    }

    getHashtagsSuggestions(word: string) {
        return this.instance.get<GetHashtagsSuggetionProps>(`hashtag/${word}`);
    }

    createTracking(uid: number, messageId: number) {
        return this.instance.post<CreateTrackingProps>(`track`, { uid, id_mensaje: messageId });
    }

    deleteTracking(messageTrackingId: number) {
        return this.instance.delete<DeleteTrackingProps>(`track/${messageTrackingId}`);
    }

    createReactionMsg(uid: number, messageId: number, reactionType: number) {
        return this.instance.post<CreateReactionMsg>(`reacc`, {
            uid,
            id_mensaje: messageId,
            tipo: reactionType,
        });
    }
}

export default SpikyService;
