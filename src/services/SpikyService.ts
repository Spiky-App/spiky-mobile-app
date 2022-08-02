import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { LoginResponse, MessagesResponse, UniversityResponse } from '../types/services/spiky';

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

  // TODO: Implementar el uid y el id del ultimo mensaje
  getMessages(uid: number, lastMessageId: number) {
    const params = {
      uid,
      id_ultimoMensaje: lastMessageId,
    };
    return this.instance.get<MessagesResponse>('mensajes?uid=1&id_ultimoMensaje=11', { params });
  }

  getAuthRenew(token: string) {
    return this.instance.get<LoginResponse>('auth/renew', {
      headers: { 'x-token': token },
    });
  }
}

export default SpikyService;
