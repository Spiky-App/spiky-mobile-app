import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class SpikyService {
  private instance: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);
  }

  login(email: string, password: string) {
    return this.instance.post('auth/login', { contrasena: password, correo: email });
  }
}

export default SpikyService;
