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
  console.log('Axios', baseURL.API);
  return axios.create({
    baseURL: baseURL.API,
    headers: {
      'Content-Type': 'application/json'
    },
  });
};

export { Axios, AxiosPrivate };
