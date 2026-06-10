import './authButton.scss';

export function AuthButton({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <button className="auth__confirm-button" type="submit">
      {children}
    </button>
  );
}
