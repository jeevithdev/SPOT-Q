/**
 * Get current date in YYYY-MM-DD format (server time)
 * @returns {string} Current date in YYYY-MM-DD format
 */
const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Get current date and time (server time)
 * @returns {Date} Current date and time
 */
const getCurrentDateTime = () => {
    return new Date();
};

/**
 * Format date to YYYY-MM-DD
 * @param {Date|string} date - Date object or date string
 * @returns {string} Formatted date in YYYY-MM-DD format
 */
const formatDate = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
        throw new Error('Invalid date');
    }
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

module.exports = {
    getCurrentDate,
    getCurrentDateTime,
    formatDate
};
