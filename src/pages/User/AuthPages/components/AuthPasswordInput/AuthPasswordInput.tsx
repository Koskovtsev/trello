import { useState } from 'react';
import './authPasswordInput.scss';

interface AuthPasswordInputProps {
  value: string;
  onChange(setPassword: string): void;
  passwordError: boolean;
  onBlur(): void;
}
export function AuthPasswordInput({ value, onChange, passwordError, onBlur }: AuthPasswordInputProps): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <span className="auth__input_title">Пароль</span>
      <div className="auth__password-wrapper">
        <input
          className={`auth__input auth__input_password ${passwordError ? `error` : ``}`}
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
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
      <div className="auth__error_container">
        {passwordError && <span className="auth__error_message">пароль занадто малий</span>}
      </div>
    </>
  );
}
