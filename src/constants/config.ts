import { AxiosRequestConfig } from 'axios';

export const socketBaseUrl: string = `${process.env.REACT_APP_BASE_URL}:${process.env.REACT_APP_PORT}`;
// this export is required to work with android emulator
// i'm searching for alternatives but for now it hasn't
// hurt anyone
export const config: AxiosRequestConfig = {
    baseURL: `${process.env.REACT_APP_BASE_URL}:${process.env.REACT_APP_PORT}/api/v1.2`,
    timeout: 8000,
    headers: { 'Content-Type': 'application/json' },
};
