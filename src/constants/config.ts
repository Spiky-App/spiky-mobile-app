import { AxiosRequestConfig } from 'axios';

export const socketBaseUrl: string = `http://localhost:${process.env.REACT_APP_PORT}`;
// this export is required to work with android emulator
// i'm searching for alternatives but for now it hasn't
// hurt anyone
export const config: AxiosRequestConfig = {
    baseURL: `http://localhost:${process.env.REACT_APP_PORT}/api/v1.4`,
    timeout: 8000,
    headers: { 'Content-Type': 'application/json' },
};
