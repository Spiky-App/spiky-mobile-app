import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { LoginResponse, MessagesResponse, UniversityResponse } from '../types/services/spiky';
import { MessageRequestData } from './models/spikyService';

interface Headers {
    'x-token': string;
}

class SpikyService {
    private instance: AxiosInstance;

    constructor(config?: AxiosRequestConfig<AxiosRequestConfig<Headers>>) {
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
        filter: string,
        parameters: MessageRequestData
    ) {
        const params = {
            uid: uid,
            id_ultimoMensaje: lastMessageId,
            ...parameters,
        };
        return this.instance.get<MessagesResponse>(`mensajes${filter}`, {
            params,
        });
    }

    getAuthRenew(token: string) {
        return this.instance.get<LoginResponse>('auth/renew', {
            headers: { 'x-token': token },
        });
    }
}

export default SpikyService;
