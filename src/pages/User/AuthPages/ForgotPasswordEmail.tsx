import toast from 'react-hot-toast';
import { useState } from 'react';
import { AuthButton } from './components/AuthButton/AuthButton';
import { AuthEmailInput } from './components/AuthEmailInput/AuthEmailInput';
import { AuthLayout } from './components/AuthLayout/AuthLayout';
import { useEmailValidation } from './hooks/useEmailValidation';
import { authHelpers } from './utils/authHelpers';
import { forgotPassword } from '../../../api/boardsService';

export function ForgotPasswordEmail(): JSX.Element {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { email, emailError, isValidEmail, handleEmailChange, handleEmailBlur } = useEmailValidation();
  const { parseBackendError } = authHelpers();
  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    const isValid = isValidEmail;
    if (!isValid) {
      toast.error(`Будь ласка, заповніть поле коректно`);
      return;
    }
    try {
      const payload = {
        email: email.trim().toLocaleLowerCase(),
      };
      await forgotPassword(payload);
      setIsEmailSent(true);
    } catch (error) {
      toast.error(parseBackendError(error, 'Помилка при відправці листа'));
    }
  };
  return (
    <AuthLayout
      title={isEmailSent ? 'Готово' : 'Введіть пошту'}
      footer={!isEmailSent && <AuthButton>Відправити посилання</AuthButton>}
      onSubmit={handleSubmit}
    >
      {!isEmailSent ? (
        <AuthEmailInput value={email} onChange={handleEmailChange} emailError={emailError} onBlur={handleEmailBlur} />
      ) : (
        <div className="auth__success-message">
          Якщо обліковий запис із такою електронною поштою існує, ми надіслали лист для відновлення пароля. Перевірте
          електронну пошту та перейдіть за посиланням для відновлення пароля.
        </div>
      )}
    </AuthLayout>
  );
}
