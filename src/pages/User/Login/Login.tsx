import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { loginUser } from '../../../api/boardsService';
import '../Registration/registration.scss';

export function Login(): JSX.Element {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const validateEmail = (enteredEmail: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(enteredEmail);
  };
  const validateForm = (): boolean => {
    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError(true);
      isValid = false;
    } else {
      setEmailError(false);
    }

    if (password.length < 8) {
      toast.error('Пароль не може бути меншим ніж 8 символів');
      setPasswordError(true);
      isValid = false;
    }
    return isValid;
  };
  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }
    const normalizedEmail = email.trim().toLowerCase();
    const payload = {
      email: normalizedEmail,
      password: password.trim(),
    };
    const response = await loginUser(payload);
    if (response.result === 'Authorized') {
      localStorage.setItem('token', response.token);
      navigate(`/`);
    } else {
      // eslint-disable-next-line no-console
      console.log(`неавторизовано. відповідь: ${JSON.stringify(response)}`);
    }
    // eslint-disable-next-line no-console
    console.log(`Авторизація. пейлоад: ${JSON.stringify(payload)}, token: ${response.token}`);
  };
  return (
    <div className="reg__wrapper">
      <div className="reg__window">
        <span className="reg__title">Вхід</span>
        <form className="reg__main" onSubmit={handleSubmit} noValidate>
          <span className="reg__input_title">E-mail</span>
          <input
            className={`login__input login__input_email ${emailError ? `error` : ``}`}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(!validateEmail(e.target.value));
            }}
            onBlur={() => setEmailError(!validateEmail(email))}
            required
          />
          <span className="reg__input_title">Пароль</span>
          <div className="reg__password-wrapper">
            <input
              className={`reg__input reg__input_password ${passwordError ? `error` : ``}`}
              type={showPassword ? 'text' : 'password'}
              value={password}
              autoComplete="new-password"
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
              required
            />
            <button
              type="button"
              className="reg__password-eye"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <i className={showPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} />
            </button>
          </div>
          <button className="reg__confirm-button">Авторизація</button>
        </form>
        <div className="reg__footer">
          <div className="reg__login_wrapper">
            <span className="reg__login_title">Вперше у нас?</span>
            <Link to="/registration/" className="reg__login_button">
              Зараєструватись
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
