import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { useClickOutside } from '../../../hooks/useClickOutside';
import './userDropdown.scss';

interface UserDropdownProps {
  isOpen(isOpen: boolean): void;
}
export function UserDropdown({ isOpen }: UserDropdownProps): JSX.Element {
  const userEmail = localStorage.getItem('user_email') ?? 'name';
  const userName = localStorage.getItem('user_name') ?? 'email';
  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside(modalRef, () => {
    isOpen(false);
  });
  return (
    <div className="user__window" ref={modalRef}>
      <span className="user__header_title">обліковий запис</span>
      <div className="user__profile">
        <div className="user__logo">{`${userName?.slice(0, 1)}`}</div>
        <div className="user__title_wrapper">
          <span className="user__email user__title">{`${userName}`}</span>
          <span className="user__name user__title">{`${userEmail}`}</span>
        </div>
      </div>
      <Link
        to="/login/"
        className="logout-link"
        onClick={() => {
          localStorage.clear();
          isOpen(false);
        }}
      >
        Змінити обліковий запис
      </Link>
      <Link
        to="/password/"
        className="logout-link"
        onClick={() => {
          isOpen(false);
        }}
      >
        Змінити пароль
      </Link>
      <Link
        to="/login/"
        className="logout-link"
        onClick={() => {
          localStorage.clear();
          isOpen(false);
        }}
      >
        Вийти
      </Link>
    </div>
  );
}
