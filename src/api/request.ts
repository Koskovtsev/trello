import axios, { AxiosResponse } from 'axios';
import NProgress from 'nprogress';
import { api } from '../common/constants';

NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.1 });

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    // Authorization: `Bearer 123`, // до цього ми ще повернемося якось потім
  },
});

instance.interceptors.request.use((config) => {
  NProgress.start();
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  // eslint-disable-next-line no-console
  // console.log(`${JSON.stringify(config)}, автрізейшн:${JSON.stringify(config.headers.Authorization)}, token: ${token}`);
  return config;
});

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    NProgress.done();
    return response.data;
  },
  (error) => {
    NProgress.done();
    if (error.response?.status === 401) {
      localStorage.removeItem('token');

      if (window.location.pathname !== '#/login/') {
        window.location.href = '#/login/';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
