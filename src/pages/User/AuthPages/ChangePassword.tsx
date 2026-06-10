import toast from 'react-hot-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthButton } from './components/AuthButton/AuthButton';
import { AuthLayout } from './components/AuthLayout/AuthLayout';
import { AuthPasswordMatchGroup } from './components/AuthPasswordMatchGroup/AuthPasswordMatchGroup';
import { changePass } from '../../../api/boardsService';
import { AuthPasswordInput } from './components/AuthPasswordInput/AuthPasswordInput';
import { authHelpers } from './utils/authHelpers';
import { usePasswordValidation } from './hooks/usePasswordValidation';

export function ChangePassword(): JSX.Element {
  const [oldPassword, setOldPassword] = useState('');
  const [oldPasswordError, setOldPasswordError] = useState(false);
  const {
    password,
    passwordError,
    confirmPassword,
    confirmPasswordError,
    strengthLevel,
    validateRegisterPassword,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handlePasswordBlur,
    handleConfirmPasswordBlur,
  } = usePasswordValidation();

  const { parseResetPassBackendError } = authHelpers();
  const navigate = useNavigate();

  const handleOldPasswordChange = (enteredPassword: string): void => {
    setOldPassword(enteredPassword);
    if (oldPasswordError) {
      setOldPasswordError(enteredPassword.length < 8);
    }
  };
  const handleOldPasswordBlur = (): void => {
    setOldPasswordError(oldPassword.length < 8);
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    const isValid = validateRegisterPassword() && oldPassword.trim().length >= 8;

    if (!isValid) {
      toast.error('Перевірте правильність введених даних');
      return;
    }
    if (oldPassword.trim() === password.trim()) {
      toast.error('Старий пароль і новий мають відрізнятись');
      return;
    }
    const payload = {
      oldPassword: oldPassword.trim(),
      newPassword: password.trim(),
    };
    try {
      const response = await changePass(payload);
      if (response === 'Updated') {
        const redirectPath = localStorage.getItem('redirectAfterLogin');
        navigate(redirectPath || '/');
        localStorage.removeItem('redirectAfterLogin');
      }
    } catch (error) {
      toast.error(parseResetPassBackendError(error));
    }
  };
  return (
    <AuthLayout title="Змінити пароль" footer={<AuthButton>Змінити пароль</AuthButton>} onSubmit={handleSubmit}>
      <AuthPasswordInput
        value={oldPassword}
        onChange={handleOldPasswordChange}
        passwordError={oldPasswordError}
        onBlur={handleOldPasswordBlur}
      />
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
