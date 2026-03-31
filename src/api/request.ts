import axios, { AxiosResponse } from 'axios';
import NProgress from 'nprogress';
import { api } from '../common/constants';

NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.1 });

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer 123', // до цього ми ще повернемося якось потім
  },
});

instance.interceptors.request.use((config) => {
  NProgress.start();
  return config;
});

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    NProgress.done();
    return response.data;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

export default instance;
