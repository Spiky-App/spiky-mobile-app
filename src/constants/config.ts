import { AxiosRequestConfig } from 'axios';
import { BASE_URL, PORT } from 'react-native-dotenv';

const config: AxiosRequestConfig = {
    baseURL: `${BASE_URL}:${PORT}/api/`,
    timeout: 10000,
};

export default config;
