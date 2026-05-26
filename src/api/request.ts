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

  const url = config.url || '';

  const isAuthRoute = url.includes('/login') || url.includes('/user');

  if (token && !isAuthRoute) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    NProgress.done();
    return response.data;
  },
  async (error) => {
    NProgress.done();
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest.isRetryRequest) {
      originalRequest.isRetryRequest = true;
      const refToken = localStorage.getItem('refreshToken');
      if (!refToken && window.location.hash !== '#/login/') {
        window.location.replace('#/login/');
        return Promise.reject(error);
      }
      try {
        const payload = { refreshToken: refToken };
        const response = await axios.post<{ result: string; token: string; refreshToken: string }>(
          `${api.baseURL}/refresh`,
          payload
        );
        if (response.data.result === 'Authorized') {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          originalRequest.headers.set('Authorization', `Bearer ${response.data.token}`);
          return await instance(originalRequest);
        }
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '#/login/';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
