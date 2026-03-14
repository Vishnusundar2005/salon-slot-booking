export const formatPhone = (phone) => {
  if (!phone) return '';
  // Simple format for Indian numbers or generic
  // E.g., +91 98765 43210
  if (phone.startsWith('+91') && phone.length === 13) {
    return `+91 ${phone.substring(3, 8)} ${phone.substring(8)}`;
  }
  return phone;
};
