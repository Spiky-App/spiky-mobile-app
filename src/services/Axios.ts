import axios from 'axios';
import { parseTokenToHeader } from '../utils/auth';

const baseURL = {
  API: 'http://localhost:4000'
};

const AxiosPrivate = () => {
  const authTokenParsed = parseTokenToHeader();
  return axios.create({
    baseURL: baseURL.API,
    headers: {
      ...authTokenParsed,
    },
  });
};

const Axios = () => {
  return axios.create({
    baseURL: baseURL.API,
    headers: {
      'Content-Type': 'application/json'
    },
  });
};

export { Axios, AxiosPrivate };
