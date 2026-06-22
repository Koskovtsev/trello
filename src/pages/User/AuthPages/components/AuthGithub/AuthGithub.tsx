import { AuthButton } from '../AuthButton/AuthButton';
import GithubIcon from '../../../../../assets/github-icon-logo.svg';

export function AuthGithub(): JSX.Element {
  const handleGithubAuth = (): void => {
    window.location.assign(`${process.env.REACT_APP_API_URL}auth/github`);
  };
  return (
    <AuthButton type="button" variant="github" onClick={handleGithubAuth} icon={<img src={GithubIcon} alt="Github" />}>
      Увійти через Github
    </AuthButton>
  );
}
