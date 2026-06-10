import { useMemo, useState } from 'react';

interface UsePasswordValidationData {
  password: string;
  confirmPassword: string;
  passwordError: boolean;
  confirmPasswordError: boolean;
  strengthLevel: number;
  validatePassword(): boolean;
  validateRegisterPassword(): boolean;
  handlePasswordChange(password: string): void;
  handleConfirmPasswordChange(confirmPassword: string): void;
  handlePasswordBlur(): void;
  handleConfirmPasswordBlur(): void;
}

export function usePasswordValidation(): UsePasswordValidationData {
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

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

  const handlePasswordChange = (enteredPassword: string): void => {
    setPassword(enteredPassword);
    if (checkPasswordStrength(enteredPassword) >= 2) {
      setPasswordError(false);
    }
  };
  const handlePasswordBlur = (): void => {
    setPasswordError(checkPasswordStrength(password) < 2);
  };
  const handleConfirmPasswordChange = (enteredPassword: string): void => {
    setConfirmPassword(enteredPassword);
    if (enteredPassword === password) {
      setConfirmPasswordError(false);
    }
  };
  const handleConfirmPasswordBlur = (): void => {
    setConfirmPasswordError(password !== confirmPassword);
  };
  const validatePassword = (): boolean => {
    let isValid = true;

    if (password.length < 8) {
      setPasswordError(true);
      isValid = false;
    }

    return isValid;
  };
  const validateRegisterPassword = (): boolean => {
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

    return isValid;
  };

  return {
    password,
    confirmPassword,
    passwordError,
    confirmPasswordError,
    strengthLevel,
    validatePassword,
    validateRegisterPassword,
    handlePasswordChange,
    handlePasswordBlur,
    handleConfirmPasswordChange,
    handleConfirmPasswordBlur,
  };
}
