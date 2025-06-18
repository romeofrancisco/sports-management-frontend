/**
 * Utility functions for formatting values for display
 */

/**
 * Format time string (HH:MM) for display in 12-hour format
 * @param {string} timeString - Time string in format "HH:MM"
 * @returns {string} Formatted time string in 12-hour format with AM/PM
 */
export const formatTime = (timeString) => {
  if (!timeString) return '';
  
  const [hours, minutes] = timeString.split(':');
  const hour24 = parseInt(hours, 10);
  const minute = parseInt(minutes, 10);
  
  // Convert to 12-hour format
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  
  // Format minutes with leading zero if needed
  const formattedMinutes = minute.toString().padStart(2, '0');
  
  return `${hour12}:${formattedMinutes} ${ampm}`;
};

/**
 * Format date object to local date string
 * @param {string|Date} date - Date object or ISO string
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

/**
 * Calculate duration between two time strings in minutes
 * @param {string} startTime - Start time in format "HH:MM"
 * @param {string} endTime - End time in format "HH:MM"
 * @returns {number} Duration in minutes
 */
export const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  
  return endTotalMinutes - startTotalMinutes;
};

/**
 * Formats a metric value based on its unit type
 * 
 * @param {number|string} value - The value to format
 * @param {string} unit - The unit of measurement (e.g., "reps", "kg", "seconds")
 * @returns {string} - Formatted value as a string
 */
export const formatMetricValue = (value, unit) => {
  if (value === null || value === undefined) return '';
  
  // Convert to number if it's a string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Handle invalid numbers
  if (isNaN(numValue)) return value.toString();
  
  // Format based on unit type
  const unitLower = unit ? unit.toLowerCase() : '';
  
  // Integer units (no decimal places)
  if (
    unitLower === 'reps' || 
    unitLower === 'repetitions' || 
    unitLower === 'sets' ||
    unitLower === 'points' ||
    unitLower === 'bpm'
  ) {
    return Math.round(numValue).toString();
  }
  
  // 1 decimal place units
  if (
    unitLower === 'kg' ||
    unitLower === 'lbs' ||
    unitLower === 'pounds' ||
    unitLower === 'in' ||
    unitLower === 'inches' ||
    unitLower === 'rating'
  ) {
    return numValue.toFixed(1);
  }
  
  // For time measurements, keep 2 decimal places for precision
  if (
    unitLower === 'seconds' || 
    unitLower === 'minutes'
  ) {
    return numValue.toFixed(2);
  }
  
  // Distance measurements
  if (
    unitLower === 'm' ||
    unitLower === 'meters' ||
    unitLower === 'cm' ||
    unitLower === 'centimeters'
  ) {
    // Use whole numbers for distances
    return Math.round(numValue).toString();
  }
  
  // For percentages
  if (unitLower === '%' || unitLower === 'percentage') {
    return numValue.toFixed(1);
  }
  
  // Default: 2 decimal places for unknown units
  return numValue.toFixed(2);
};
