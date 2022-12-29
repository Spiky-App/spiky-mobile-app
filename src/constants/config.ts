import { AxiosRequestConfig } from 'axios';

export const socketBaseUrl: string = `https://spiky-services-prod.herokuapp.com`;
// this export is required to work with android emulator
// i'm searching for alternatives but for now it hasn't
// hurt anyone
export const config: AxiosRequestConfig = {
    baseURL: `https://spiky-services-prod.herokuapp.com/api`,
    timeout: 10000,
    headers: {},
};
