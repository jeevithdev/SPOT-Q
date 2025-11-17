import api from './api';

/**
 * Fetch current date from backend (server time)
 * @returns {Promise<string>} Current date in YYYY-MM-DD format
 */
export const getCurrentDate = async () => {
  try {
    const response = await api.get('/system/current-date');
    if (response.success && response.data?.date) {
      return response.data.date;
    }
    // Fallback to client-side date if API fails
    return getClientDate();
  } catch (error) {
    console.warn('Failed to fetch server date, using client date:', error);
    // Fallback to client-side date
    return getClientDate();
  }
};

/**
 * Get client-side current date (fallback)
 * @returns {string} Current date in YYYY-MM-DD format
 */
const getClientDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format date to DD/MM/YYYY display format
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @returns {string} Date in DD/MM/YYYY format
 */
export const formatDateDisplay = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

/**
 * Format date to YYYY-MM-DD format
 * @param {Date|string} date - Date object or date string
 * @returns {string} Date in YYYY-MM-DD format
 */
export const formatDateISO = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
