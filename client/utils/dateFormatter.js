import { format, parseISO } from 'date-fns';

export const formatDate = (dateString, formatStr = 'PPP') => {
  if (!dateString) return '';
  // dateString is typically YYYY-MM-DD from the backend
  return format(parseISO(dateString), formatStr);
};

export const formatTime = (timeString) => {
  if (!timeString) return '';
  // timeString is typically HH:mm
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  return format(date, 'h:mm a');
};
