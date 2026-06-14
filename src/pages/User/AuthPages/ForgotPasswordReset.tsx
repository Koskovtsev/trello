import toast from 'react-hot-toast';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthButton } from './components/AuthButton/AuthButton';
import { AuthLayout } from './components/AuthLayout/AuthLayout';
import { AuthPasswordMatchGroup } from './components/AuthPasswordMatchGroup/AuthPasswordMatchGroup';
import { resetPassword } from '../../../api/boardsService';
import { authHelpers } from './utils/authHelpers';
import { usePasswordValidation } from './hooks/usePasswordValidation';

export function ForgotPasswordReset(): JSX.Element {
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
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    const isValid = validateRegisterPassword();

    if (!isValid) {
      toast.error('Перевірте правильність введених даних');
      return;
    }
    const payload = {
      token,
      newPassword: password.trim(),
    };
    try {
      const response = await resetPassword(payload);
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
    <AuthLayout
      title="Створити новий пароль"
      footer={<AuthButton>Створити новий пароль</AuthButton>}
      onSubmit={handleSubmit}
    >
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
