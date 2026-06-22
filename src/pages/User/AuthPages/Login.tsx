import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from './components/AuthLayout/AuthLayout';
import { loginUser } from '../../../api/boardsService';
import { AuthButton } from './components/AuthButton/AuthButton';
import { AuthEmailInput } from './components/AuthEmailInput/AuthEmailInput';
import { AuthPasswordInput } from './components/AuthPasswordInput/AuthPasswordInput';
import { authHelpers } from './utils/authHelpers';
import { useEmailValidation } from './hooks/useEmailValidation';
import { usePasswordValidation } from './hooks/usePasswordValidation';
import { AuthGoogle } from './components/AuthGoogle/AuthGoogle';
import { AuthGithub } from './components/AuthGithub/AuthGithub';

export function Login(): JSX.Element {
  const { email, emailError, isValidEmail, handleEmailChange, handleEmailBlur } = useEmailValidation();
  const { password, passwordError, validatePassword, handlePasswordChange, handlePasswordBlur } =
    usePasswordValidation();

  const { parseBackendError } = authHelpers();
  const navigate = useNavigate();

  const login = async (): Promise<void> => {
    const normalizedEmail = email.trim().toLowerCase();
    const payload = {
      email: normalizedEmail,
      password: password.trim(),
    };
    const response = await loginUser(payload);
    if (response.result === 'Authorized') {
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      const username = payload.email.split('@')[0].toLowerCase();
      localStorage.setItem('user_name', username);
      localStorage.setItem('user_email', payload.email);
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      if (redirectPath) localStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath || '/');
    }
  };
  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    const isValid = isValidEmail && validatePassword();
    if (!isValid) {
      toast.error(`Будь ласка, заповніть усі поля коректно`);
      return;
    }
    try {
      await login();
    } catch (error) {
      toast.error(parseBackendError(error, 'Помилка при авторизації'));
    }
  };
  return (
    <AuthLayout
      title="Вхід"
      footer={
        <>
          <AuthButton>Увійти</AuthButton>
          <div className="auth__footer">
            <div className="auth__login_wrapper">
              <span className="auth__login_title">Вперше у нас?</span>
              <Link to="/registration/" className="auth__login_button">
                Зареєструватися
              </Link>
            </div>
            <div className="auth__login_wrapper">
              <span className="auth__login_title">Забули пароль?</span>
              <Link to="/forgot-password-email/" className="auth__login_button">
                Скинути пароль
              </Link>
            </div>
          </div>
        </>
      }
      onSubmit={handleSubmit}
    >
      <AuthGoogle />
      <AuthGithub />
      <span className="auth__alternative-auth">Або</span>
      <AuthEmailInput value={email} onChange={handleEmailChange} emailError={emailError} onBlur={handleEmailBlur} />
      <AuthPasswordInput
        value={password}
        onChange={handlePasswordChange}
        passwordError={passwordError}
        onBlur={handlePasswordBlur}
      />
    </AuthLayout>
  );
}
