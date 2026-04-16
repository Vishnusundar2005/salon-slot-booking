'use client';

import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from '../store/store';
import { setUser, setLoading } from '../store/authSlice';
import { setTheme } from '../store/themeSlice';
import api from '../services/api';

function AppInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // 1. Initialize Auth
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          dispatch(setUser(data));
        } catch (error) {
          console.error('Failed to authenticate token', error);
          localStorage.removeItem('token');
          dispatch(setUser(null));
        }
      } else {
        dispatch(setUser(null));
      }
      dispatch(setLoading(false));
    };

    fetchUser();

    // 2. Initialize Theme
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = saved || (prefersDark ? 'dark' : 'light');
    dispatch(setTheme(initialTheme));
    
  }, [dispatch]);

  return <>{children}</>;
}

export function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <AppInitializer>{children}</AppInitializer>
    </Provider>
  );
}
