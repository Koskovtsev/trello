import { useState } from 'react';
import './authPasswordMatchGroup.scss';

interface AuthPasswordMatchGroupProps {
  value: string;
  confirmValue: string;
  onChange(setPassword: string): void;
  onConfirmChange(setConfirmPassword: string): void;
  passwordError: boolean;
  confirmPasswordError: boolean;
  onBlur(): void;
  onConfirmBlur(): void;
  strengthLevel: number;
}
export function AuthPasswordMatchGroup({
  value,
  onChange,
  onConfirmChange,
  passwordError,
  confirmPasswordError,
  onBlur,
  onConfirmBlur,
  strengthLevel,
  confirmValue,
}: AuthPasswordMatchGroupProps): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <span className="auth__input_title">Пароль</span>
      <div className="auth__password-wrapper">
        <input
          className={`auth__input auth__input_password ${passwordError ? `error` : ``}`}
          type={showPassword ? 'text' : 'password'}
          value={value}
          autoComplete="new-password"
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          required
        />
        <button
          type="button"
          className="auth__password-eye"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <i className={showPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} />
        </button>
      </div>
      <div className="auth__reliability_wrapper">
        <div className={`auth__reliability ${strengthLevel >= 1 ? `auth__reliability_zero` : ''}`} />
        <div className={`auth__reliability ${strengthLevel >= 2 ? `auth__reliability_low` : ''}`} />
        <div className={`auth__reliability ${strengthLevel >= 3 ? `auth__reliability_medium` : ''}`} />
        <div className={`auth__reliability ${strengthLevel >= 4 ? `auth__reliability_high` : ''}`} />
      </div>
      <div className="auth__error_container">
        {passwordError && <span className="auth__error_message">пароль занадто малий або не надійний</span>}
      </div>
      <span className="auth__input_title">Повторіть пароль</span>
      <div className="auth__password-wrapper">
        <input
          className={`auth__input auth__input_confirm-password ${confirmPasswordError ? `error` : ``}`}
          type={showPassword ? 'text' : 'password'}
          value={confirmValue}
          autoComplete="new-password"
          onChange={(e) => onConfirmChange(e.target.value)}
          required
          onBlur={onConfirmBlur}
        />
        <button
          type="button"
          className="auth__password-eye"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <i className={showPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} />
        </button>
      </div>
      <div className="auth__error_container">
        {confirmPasswordError && <span className="auth__error_message">Паролі не збігаються</span>}
      </div>
    </>
  );
}
