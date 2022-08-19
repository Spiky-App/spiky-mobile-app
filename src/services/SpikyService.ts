import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
    LoginResponse,
    GetMessagesResponse,
    UniversityResponse,
    MessageRequestParams,
    CreateMessageResponse,
} from '../types/services/spiky';

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
        lastMessageId: number,
        parameters: MessageRequestParams,
        filter?: string
    ) {
        const params = {
            uid: uid,
            id_ultimoMensaje: lastMessageId,
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
}

export default SpikyService;
