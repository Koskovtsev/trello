import axios from 'axios';

interface BackendError {
  error: string;
}
interface AuthHelpersData {
  parseBackendError(error: unknown, message: string): string;
  parseResetPassBackendError(error: unknown): string;
}

export const authHelpers = (): AuthHelpersData => {
  function isAxiosError(error: unknown): error is import('axios').AxiosError {
    return axios.isAxiosError(error);
  }
  const parseBackendError = (error: unknown, message: string): string => {
    if (isAxiosError(error)) {
      if (error.response?.status === 400) {
        let serverMessage = message;
        const data = error.response?.data;
        if (data) {
          if (typeof data === 'string') {
            try {
              const parsed = JSON.parse(data);
              serverMessage = parsed.error || serverMessage;
            } catch {
              serverMessage = data;
            }
          } else {
            serverMessage = (data as BackendError).error || serverMessage;
          }
        }
        return serverMessage;
      }
      return 'Щось пішло не так, спробуйте пізніше';
    }
    return 'Невідома помилка';
  };

  const parseResetPassBackendError = (error: unknown): string => {
    if (isAxiosError(error)) {
      if (error.response?.status === 400 || error.response?.status === 401) {
        return 'Не вірно введено поточний пароль';
      }
      return 'Щось пішло не так, спробуйте пізніше';
    }
    return 'Невідома помилка';
  };

  return { parseBackendError, parseResetPassBackendError };
};
