import { AxiosRequestConfig } from 'axios';
// import { BASE_URL, PORT } from 'react-native-dotenv';

// export const socketBaseUrl: string = `${BASE_URL}:${PORT}`;
export const socketBaseUrl: string = `https://spiky-services.herokuapp.com`;
// this export is required to work with android emulator
// i'm searching for alternatives but for now it hasn't
// hurt anyone
export const config: AxiosRequestConfig = {
    // baseURL: `${BASE_URL}:${PORT}/api/`,
    baseURL: `https://spiky-services.herokuapp.com/api/`,
    timeout: 10000,
    headers: {},
};
