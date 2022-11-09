import { AxiosRequestConfig } from 'axios';
import { BASE_URL, PORT } from 'react-native-dotenv';

export const socketBaseUrl: string = `${BASE_URL}:${PORT}`;

// this export is required to work with android emulator
// i'm searching for alternatives but for now it hasn't
// hurt anyone
export const config: AxiosRequestConfig = {
    baseURL: `${BASE_URL}:${PORT}/api`,
    timeout: 10000,
    headers: {},
};
