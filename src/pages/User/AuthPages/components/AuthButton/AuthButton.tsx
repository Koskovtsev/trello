import './authButton.scss';

interface AuthButtonProps {
  children: React.ReactNode;
  type?: 'submit' | 'button';
  variant?: 'primary' | 'google' | 'github';
  onClick?: () => void;
  icon?: React.ReactNode;
}
export function AuthButton({
  children,
  onClick,
  type = 'submit',
  variant = 'primary',
  icon,
}: AuthButtonProps): JSX.Element {
  return (
    <button className={`auth__confirm-button auth__confirm-button-${variant}`} type={type} onClick={onClick}>
      {icon && <span className="auth__icon-wrapper">{icon}</span>}
      <span className="auth__text">{children}</span>
    </button>
  );
}

AuthButton.defaultProps = {
  type: 'submit',
  variant: 'primary',
  onClick: undefined,
  icon: undefined,
};
