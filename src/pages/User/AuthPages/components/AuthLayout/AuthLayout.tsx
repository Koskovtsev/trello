import './authLayout.scss';

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  footer: React.ReactNode;
}

export function AuthLayout({ title, children, onSubmit, footer }: AuthLayoutProps): JSX.Element {
  return (
    <div className="auth__wrapper">
      <div className="auth__window">
        <div className="auth__header">
          <span className="auth__title">{title}</span>
        </div>
        <form className="auth__main" onSubmit={onSubmit}>
          {children}
          {footer && <div className="auth__footer">{footer}</div>}
        </form>
      </div>
    </div>
  );
}
