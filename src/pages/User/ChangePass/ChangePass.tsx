import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { changePass } from '../../../api/boardsService';
import '../AuthPage/authPage.scss';

export function ChangePass(): JSX.Element {
  const [oldPassword, setOldPassword] = useState('');
  const [oldPasswordError, setOldPasswordError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const navigate = useNavigate();
  // eslint-disable-next-line no-console
  console.log(
    `changePass menu is open, token: ${localStorage.getItem('token')}, refToken: ${localStorage.getItem('refreshToken')}`
  );
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
  const validateForm = (): boolean => {
    let isValid = true;

    if (strengthLevel < 3) {
      setPasswordError(true);
      isValid = false;
    } else {
      setPasswordError(false);
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      isValid = false;
    } else {
      setConfirmPasswordError(false);
    }

    if (password.length < 8 || oldPassword.length < 8) {
      toast.error('Пароль не може бути меншим ніж 8 символів');
      setPasswordError(true);
      isValid = false;
    }
    return isValid;
  };
  function isAxiosError(error: unknown): error is import('axios').AxiosError {
    return axios.isAxiosError(error);
  }
  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    // eslint-disable-next-line no-console
    // console.log(
    //   `SUBMIT STARTED token: ${localStorage.getItem('token')}, refToken: ${localStorage.getItem('refreshToken')}`
    // );
    const isValid = validateForm();

    if (!isValid) {
      toast.error('Перевірте правильність введених даних');
      return;
    }
    const payload = {
      oldPassword: oldPassword.trim(),
      newPassword: password.trim(),
    };
    try {
      const response = await changePass(payload);
      if (response === 'Updated') {
        setOldPassword('');
        setPassword('');
        setConfirmPassword('');
        const redirectPath = localStorage.getItem('redirectAfterLogin');
        navigate(redirectPath || '/');
        localStorage.removeItem('redirectAfterLogin');
      }
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          toast.error('Не вірно введено поточний пароль');
        } else {
          toast.error('Щось пішло не так, спробуйте пізніше');
        }
      } else {
        toast.error('Невідома помилка');
      }
    }
  };
  return (
    <div className="pass__wrapper">
      <div className="pass__window">
        <div className="pass__header">
          <span className="pass__title">Змінити пароль</span>
        </div>
        <form className="pass__main" onSubmit={handleSubmit} noValidate>
          <span className="pass__input_title">старий пароль</span>
          <div className="pass__password-wrapper">
            <input
              className={`pass__input pass__input_old-password ${oldPasswordError ? `error` : ``}`}
              type={showOldPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                if (oldPasswordError) {
                  setOldPasswordError(oldPassword.length < 8);
                }
              }}
              onBlur={() => setOldPasswordError(oldPassword.length < 8)}
              required
            />
            <button
              type="button"
              className="pass__password-eye"
              onClick={() => setShowOldPassword((prev) => !prev)}
              aria-label={showOldPassword ? 'Hide password' : 'Show password'}
            >
              <i className={showOldPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} />
            </button>
          </div>
          <div className="pass__error_container">
            {oldPasswordError && <span className="pass__error_message">пароль має бути не менш ніж 8 символів</span>}
          </div>
          <span className="pass__input_title">Пароль</span>
          <div className="pass__password-wrapper">
            <input
              className={`pass__input pass__input_password ${passwordError ? `error` : ``}`}
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
              className="pass__password-eye"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <i className={showPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} />
            </button>
          </div>
          <div className="pass__reliability_wrapper">
            <div className={`pass__reliability ${strengthLevel >= 1 ? `pass__reliability_zero` : ''}`} />
            <div className={`pass__reliability ${strengthLevel >= 2 ? `pass__reliability_low` : ''}`} />
            <div className={`pass__reliability ${strengthLevel >= 3 ? `pass__reliability_medium` : ''}`} />
            <div className={`pass__reliability ${strengthLevel >= 4 ? `pass__reliability_high` : ''}`} />
          </div>
          <div className="pass__error_container">
            {passwordError && <span className="pass__error_message">пароль занадто малий або не надійний</span>}
          </div>
          <span className="pass__input_title">Повторіть пароль</span>
          <div className="pass__password-wrapper">
            <input
              className={`pass__input pass__input_confirm-password ${confirmPasswordError ? `error` : ``}`}
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
              className="pass__password-eye"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <i className={showPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} />
            </button>
          </div>
          <div className="pass__error_container">
            {confirmPasswordError && <span className="pass__error_message">Паролі не збігаються</span>}
          </div>
          <button className="pass__confirm-button">Змінити пароль</button>
        </form>
      </div>
    </div>
  );
}
