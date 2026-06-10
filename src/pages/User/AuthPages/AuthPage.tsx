import toast from 'react-hot-toast';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { createUser, loginUser } from '../../../api/boardsService';
import './authPage.scss';

interface AuthPageProps {
  type: 'login' | 'register';
}

interface BackendError {
  error: string;
}

export function AuthPage({ type }: AuthPageProps): JSX.Element {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setEmailError(false);
    setPasswordError(false);
    setConfirmPasswordError(false);
  }, [type]);

  const validateEmail = (enteredEmail: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(enteredEmail);
  };
  const checkPasswordStrength = (enteredPassword: string): number => {
    if (enteredPassword.length === 0) return 0;
    if (enteredPassword.length < 8) return 1;
    let score = 1;
    if (/\d/.test(enteredPassword)) score++;
    if (/[A-ZА-ЯЁІЇЄ]/.test(enteredPassword)) score++;
    if (/[^A-Za-zА-Яа-яІЇЄієї0-9]/.test(enteredPassword)) score++;
    return Math.min(score, 4);
  };
  const strengthLevel = useMemo(() => checkPasswordStrength(password), [password]);
  const isLogin = type === 'login';
  const validateForm = (): boolean => {
    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError(true);
      isValid = false;
    } else {
      setEmailError(false);
    }

    if (strengthLevel < 3 && !isLogin) {
      setPasswordError(true);
      isValid = false;
    } else {
      setPasswordError(false);
    }

    if (password !== confirmPassword && !isLogin) {
      setConfirmPasswordError(true);
      isValid = false;
    } else {
      setConfirmPasswordError(false);
    }

    if (password.length < 8 && isLogin) {
      toast.error('Пароль не може бути меншим ніж 8 символів');
      setPasswordError(true);
      isValid = false;
    }
    return isValid;
  };
  const register = async (payload: { email: string; password: string }): Promise<void> => {
    const newUserId = await createUser(payload);
    if (newUserId) {
      const response = await loginUser(payload);
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      const username = payload.email.split('@')[0].toLowerCase();
      localStorage.setItem('user_name', username);
      localStorage.setItem('user_email', payload.email);
      navigate(`/`);
    }
  };
  function isAxiosError(error: unknown): error is import('axios').AxiosError {
    return axios.isAxiosError(error);
  }
  const login = async (payload: { email: string; password: string }): Promise<void> => {
    const response = await loginUser(payload);
    if (response.result === 'Authorized') {
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      const username = payload.email.split('@')[0].toLowerCase();
      localStorage.setItem('user_name', username);
      localStorage.setItem('user_email', payload.email);
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      navigate(redirectPath || '/');
      localStorage.removeItem('redirectAfterLogin');
    }
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      toast.error('Перевірте правильність введених даних');
      return;
    }
    const normalizedEmail = email.trim().toLowerCase();
    const payload = {
      email: normalizedEmail,
      password: password.trim(),
    };
    try {
      if (isLogin) {
        await login(payload);
      } else {
        await register(payload);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 400) {
          let serverMessage = 'Помилка при реєстрації';
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
          toast.error(serverMessage);
        } else {
          toast.error('Щось пішло не так, спробуйте пізніше');
        }
      } else {
        toast.error('Невідома помилка');
      }
    }
  };
  return (
    <div className="reg__wrapper">
      <div className="reg__window">
        <div className="reg__header">
          <span className="reg__title">{`${isLogin ? 'Вхід' : 'Реєстрація'}`}</span>
        </div>
        <form className="reg__main" onSubmit={handleSubmit} noValidate>
          <span className="reg__input_title">E-mail</span>
          <input
            className={`reg__input reg__input_email ${emailError ? `error` : ``}`}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) {
                setEmailError(!validateEmail(e.target.value));
              }
            }}
            onBlur={() => setEmailError(!validateEmail(email))}
            required
          />
          <div className="reg__error_container">
            {emailError && <span className="reg__error_message">виправте E-mail</span>}
          </div>
          <span className="reg__input_title">Пароль</span>
          <div className="reg__password-wrapper">
            <input
              className={`reg__input reg__input_password ${passwordError ? `error` : ``}`}
              type={showPassword ? 'text' : 'password'}
              value={password}
              autoComplete="new-password"
              onChange={(e) => {
                setPassword(e.target.value);
                if (checkPasswordStrength(e.target.value) >= 2) {
                  setPasswordError(false);
                }
              }}
              required
            />
            <button
              type="button"
              className="reg__password-eye"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <i className={showPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} />
            </button>
          </div>
          {!isLogin && (
            <div className="reg__reliability_wrapper">
              <div className={`reg__reliability ${strengthLevel >= 1 ? `reg__reliability_zero` : ''}`} />
              <div className={`reg__reliability ${strengthLevel >= 2 ? `reg__reliability_low` : ''}`} />
              <div className={`reg__reliability ${strengthLevel >= 3 ? `reg__reliability_medium` : ''}`} />
              <div className={`reg__reliability ${strengthLevel >= 4 ? `reg__reliability_high` : ''}`} />
            </div>
          )}
          <div className="reg__error_container">
            {passwordError && <span className="reg__error_message">пароль занадто малий або не надійний</span>}
          </div>
          {!isLogin && (
            <>
              <span className="reg__input_title">Повторіть пароль</span>
              <div className="reg__password-wrapper">
                <input
                  className={`reg__input reg__input_confirm-password ${confirmPasswordError ? `error` : ``}`}
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  autoComplete="new-password"
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmPasswordError(password !== e.target.value);
                  }}
                  required
                />
                <button
                  type="button"
                  className="reg__password-eye"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={showPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} />
                </button>
              </div>
              <div className="reg__error_container">
                {confirmPasswordError && <span className="reg__error_message">Паролі не збігаються</span>}
              </div>
            </>
          )}
          <button className="reg__confirm-button">{`${isLogin ? 'Авторизація' : 'Зареєструватись'}`}</button>
        </form>
        <div className="reg__footer">
          {isLogin ? (
            <div className="reg__login_wrapper">
              <span className="reg__login_title">Вперше у нас?</span>
              <Link to="/registration/" className="reg__login_button">
                Зараєструватись
              </Link>
            </div>
          ) : (
            <div className="reg__login_wrapper">
              <span className="reg__login_title">Вже є акаунт?</span>
              <Link to="/login/" className="reg__login_button">
                Увійти
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
