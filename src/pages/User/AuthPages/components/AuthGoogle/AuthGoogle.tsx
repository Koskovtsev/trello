import { AuthButton } from '../AuthButton/AuthButton';
import GoogleIcon from '../../../../../assets/google-icon-logo.svg';

export function AuthGoogle(): JSX.Element {
  const handleGoogleAuth = (): void => {
    window.location.assign(`${process.env.REACT_APP_API_URL}auth/google`);
  };
  return (
    <AuthButton type="button" variant="google" onClick={handleGoogleAuth} icon={<img src={GoogleIcon} alt="Google" />}>
      Увійти через Google
    </AuthButton>
  );
}
