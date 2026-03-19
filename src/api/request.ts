import axios, { AxiosResponse } from 'axios';
import { api } from '../common/constants';

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer 123', // до цього ми ще повернемося якось потім
  },
});

instance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => Promise.reject(error)
);

export default instance;
