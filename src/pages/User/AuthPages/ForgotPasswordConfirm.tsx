import { useNavigate } from 'react-router-dom';
import { AuthButton } from './components/AuthButton/AuthButton';
import { AuthLayout } from './components/AuthLayout/AuthLayout';

export function FrogotPasswordConfirm(): JSX.Element {
  const navigate = useNavigate();
  const handleSubmit = async (): Promise<void> => {
    navigate('/');
  };
  return (
    <AuthLayout title="Посилання відправлено" footer={<AuthButton>Ок</AuthButton>} onSubmit={handleSubmit}>
      <span className="auth__input_title">натисніть на посилання в листі</span>
    </AuthLayout>
  );
}
