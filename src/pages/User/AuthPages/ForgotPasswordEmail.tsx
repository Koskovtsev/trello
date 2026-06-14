import toast from 'react-hot-toast';
import { AuthButton } from './components/AuthButton/AuthButton';
import { AuthEmailInput } from './components/AuthEmailInput/AuthEmailInput';
import { AuthLayout } from './components/AuthLayout/AuthLayout';
import { useEmailValidation } from './hooks/useEmailValidation';
import { authHelpers } from './utils/authHelpers';
import { forgotPassword } from '../../../api/boardsService';

export function ForgotPasswordEmail(): JSX.Element {
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
    } catch (error) {
      toast.error(parseBackendError(error, 'Помилка при відправці листа'));
    }
  };
  return (
    <AuthLayout title="Введіть пошту" footer={<AuthButton>Відправити посилання</AuthButton>} onSubmit={handleSubmit}>
      <AuthEmailInput value={email} onChange={handleEmailChange} emailError={emailError} onBlur={handleEmailBlur} />
    </AuthLayout>
  );
}
