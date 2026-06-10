import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { AuthButton } from './components/AuthButton/AuthButton';
import { AuthLayout } from './components/AuthLayout/AuthLayout';
import { AuthEmailInput } from './components/AuthEmailInput/AuthEmailInput';
import { createUser, loginUser } from '../../../api/boardsService';
import { AuthPasswordMatchGroup } from './components/AuthPasswordMatchGroup/AuthPasswordMatchGroup';
import { authHelpers } from './utils/authHelpers';
import { useEmailValidation } from './hooks/useEmailValidation';
import { usePasswordValidation } from './hooks/usePasswordValidation';

export function Register(): JSX.Element {
  const { email, emailError, isValidEmail, handleEmailBlur, handleEmailChange } = useEmailValidation();
  const {
    password,
    confirmPassword,
    passwordError,
    confirmPasswordError,
    strengthLevel,
    validateRegisterPassword,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handlePasswordBlur,
    handleConfirmPasswordBlur,
  } = usePasswordValidation();
  const { parseBackendError } = authHelpers();

  const navigate = useNavigate();

  const registerUser = async (): Promise<void> => {
    const normalizedEmail = email.trim().toLowerCase();
    const payload = {
      email: normalizedEmail,
      password: password.trim(),
    };
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

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    const isValid = isValidEmail && validateRegisterPassword();
    if (!isValid) {
      toast.error('Перевірте правильність введених даних');
      return;
    }

    try {
      await registerUser();
    } catch (error) {
      toast.error(parseBackendError(error, 'Помилка при реєстрації'));
    }
  };

  return (
    <AuthLayout
      title="Реєстрація"
      footer={
        <>
          <AuthButton>Зараєструватись</AuthButton>
          <div className="auth__footer">
            <div className="auth__login_wrapper">
              <span className="auth__login_title">Вже зареєстровані?</span>
              <Link to="/login/" className="auth__login_button">
                Увійти
              </Link>
            </div>
          </div>
        </>
      }
      onSubmit={handleSubmit}
    >
      <AuthEmailInput value={email} onChange={handleEmailChange} emailError={emailError} onBlur={handleEmailBlur} />
      <AuthPasswordMatchGroup
        value={password}
        confirmValue={confirmPassword}
        onChange={handlePasswordChange}
        onConfirmChange={handleConfirmPasswordChange}
        passwordError={passwordError}
        confirmPasswordError={confirmPasswordError}
        onBlur={handlePasswordBlur}
        onConfirmBlur={handleConfirmPasswordBlur}
        strengthLevel={strengthLevel}
      />
    </AuthLayout>
  );
}
