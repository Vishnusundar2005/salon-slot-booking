'use client';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme as toggleAction } from '../store/themeSlice';

export const useTheme = () => {
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const toggleTheme = () => {
    dispatch(toggleAction());
  };

  return { theme, toggleTheme };
};
