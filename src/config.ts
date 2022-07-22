import { AxiosRequestConfig } from "axios";

const host = 'http://192.168.0.146:4000';

const config: AxiosRequestConfig = {
  baseURL: `${host}/api/`,
  timeout: 10000,
  headers: {},
};

export default config;
