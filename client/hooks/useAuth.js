'use client';
import { useSelector, useDispatch } from 'react-redux';
import { login as loginAction, logout as logoutAction } from '../store/authSlice';

export const useAuth = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    dispatch(loginAction(userData));
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch(logoutAction());
  };

  return { user, loading, login, logout };
};
