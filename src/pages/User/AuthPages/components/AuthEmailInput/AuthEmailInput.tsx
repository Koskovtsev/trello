import './authEmailInput.scss';

interface AuthEmailInputProps {
  value: string;
  onChange(setEmail: string): void;
  emailError: boolean;
  onBlur(): void;
}
export function AuthEmailInput({ value, onChange, emailError, onBlur }: AuthEmailInputProps): JSX.Element {
  return (
    <>
      <span className="auth__input_title">E-mail</span>
      <input
        className={`auth__input auth__input_email ${emailError ? `error` : ``}`}
        type="email"
        autoComplete="email"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        onBlur={onBlur}
        required
      />
      <div className="auth__error_container">
        {emailError && <span className="auth__error_message">виправте E-mail</span>}
      </div>
    </>
  );
}
