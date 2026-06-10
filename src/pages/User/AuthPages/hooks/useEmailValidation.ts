import { useState } from 'react';

interface UseEmailValidationData {
  email: string;
  emailError: boolean;
  isValidEmail: boolean;
  handleEmailChange(enteredEmail: string): void;
  handleEmailBlur(): void;
}

export function useEmailValidation(): UseEmailValidationData {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);

  const validateEmail = (enteredEmail: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(enteredEmail);
  };

  const handleEmailChange = (enteredEmail: string): void => {
    setEmail(enteredEmail);
    if (emailError) {
      setEmailError(!validateEmail(enteredEmail));
    }
  };
  const handleEmailBlur = (): void => {
    setEmailError(!validateEmail(email));
  };
  const isValidEmail = validateEmail(email.trim());

  return { email, emailError, isValidEmail, handleEmailChange, handleEmailBlur };
}
