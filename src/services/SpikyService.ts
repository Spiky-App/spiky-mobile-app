import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  AuthRenewResponseData,
  LoginResponseData,
  MessagesResponseData,
  UniversitiesResponseData,
} from './models/spikyService';

interface Headers {
  'x-token': string;
}

class SpikyService {
  private instance: AxiosInstance;

  constructor(config?: AxiosRequestConfig<AxiosRequestConfig<Headers>>) {
    this.instance = axios.create(config);
  }

  login(email: string, password: string) {
    return this.instance.post<LoginResponseData>('auth/login', {
      contrasena: password,
      correo: email,
    });
  }

  getUniversities() {
    return this.instance.get<UniversitiesResponseData>('univer');
  }

  // TODO: Implementar el uid y el id del ultimo mensaje
  getIdeas() {
    return this.instance.get<MessagesResponseData>('mensajes?uid=1&id_ultimoMensaje=11');
  }

  getAuthRenew(token: string) {
    return this.instance.get<LoginResponseData>('auth/renew', {
      headers: { 'x-token': token },
    });
  }
}

export default SpikyService;
