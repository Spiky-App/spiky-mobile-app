import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  LoginResponseData,
  MessagesResponseData,
  UniversitiesResponseData
} from "./models/spikyService";

class SpikyService {
  private instance: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);
  }

  login(email: string, password: string) {
    return this.instance.post<LoginResponseData>("auth/login", {
      contrasena: password,
      correo: email
    });
  }

  getUniversities(token: string) {
    return this.instance.get<UniversitiesResponseData>("univer", {
      headers: {
        'x-token': token,
      },
    });
  }

  // TODO: Implementar el uid y el id del ultimo mensaje
  getIdeas(token: string) {
    return this.instance.get<MessagesResponseData>("mensajes?uid=1&id_ultimoMensaje=11", {
      headers: {
        'x-token': token,
      },
    });
  }
}

export default SpikyService;
