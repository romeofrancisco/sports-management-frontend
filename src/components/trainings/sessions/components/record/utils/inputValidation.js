/**
 * Utility functions for numeric input validation in metric input fields
 */

/**
 * Validates and filters numeric input values
 * @param {string} inputValue - The raw input value to validate
 * @param {Object} metric - The metric configuration object
 * @param {boolean} metric.is_lower_better - Whether lower values are better for this metric
 * @returns {Object} - { isValid: boolean, filteredValue: string }
 */
export const validateNumericInput = (inputValue, metric) => {
  // Allow empty string
  if (inputValue === '') {
    return { isValid: true, filteredValue: '' };
  }

  // Only allow numbers, decimal point, and negative sign (if lower is better)
  const isValidChar = /^-?\d*\.?\d*$/.test(inputValue);
  
  // Prevent multiple decimal points
  const decimalCount = (inputValue.match(/\./g) || []).length;
  if (decimalCount > 1) {
    return { isValid: false, filteredValue: inputValue };
  }
  
  // Prevent multiple negative signs or negative sign not at the beginning
  if (inputValue.includes('-') && inputValue.indexOf('-') !== 0) {
    return { isValid: false, filteredValue: inputValue };
  }
  
  // If the metric doesn't allow negative values and input starts with negative, reject it
  if (!metric.is_lower_better && inputValue.startsWith('-')) {
    return { isValid: false, filteredValue: inputValue };
  }
  
  // Return validation result
  return { 
    isValid: isValidChar, 
    filteredValue: isValidChar ? inputValue : inputValue 
  };
};

/**
 * Handles keypress events to prevent invalid characters from being typed
 * @param {KeyboardEvent} e - The keyboard event
 * @param {string} currentValue - The current input value
 * @param {Object} metric - The metric configuration object
 * @param {boolean} metric.is_lower_better - Whether lower values are better for this metric
 * @returns {boolean} - Whether the key press should be allowed
 */
export const handleNumericKeyPress = (e, currentValue, metric) => {
  const char = e.key;
  
  // Allow control keys (backspace, delete, tab, escape, enter, arrow keys)
  const controlKeys = [
    'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 
    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
  ];
  
  if (controlKeys.includes(char)) {
    return true;
  }
  
  // Allow keyboard shortcuts (Ctrl+A, Ctrl+C, etc.)
  if (e.ctrlKey && ['a', 'c', 'v', 'x', 'z'].includes(char.toLowerCase())) {
    return true;
  }
  
  // Allow digits
  if (/\d/.test(char)) {
    return true;
  }
  
  // Allow decimal point if there isn't one already
  if (char === '.' && !currentValue.includes('.')) {
    return true;
  }
  
  // Allow negative sign only at the beginning and only if metric allows it
  if (char === '-' && currentValue.length === 0 && metric.is_lower_better) {
    return true;
  }
  
  // Block all other characters
  return false;
};

/**
 * Creates a numeric input change handler
 * @param {Function} onChange - The onChange callback function
 * @param {Object} metric - The metric configuration object
 * @returns {Function} - Input change handler function
 */
export const createNumericInputHandler = (onChange, metric) => {
  return (inputValue) => {
    const { isValid, filteredValue } = validateNumericInput(inputValue, metric);
    
    if (isValid) {
      onChange(filteredValue);
    }
  };
};

/**
 * Creates a numeric keypress handler
 * @param {Object} metric - The metric configuration object
 * @returns {Function} - Keypress handler function
 */
export const createNumericKeyPressHandler = (metric) => {
  return (e) => {
    const currentValue = e.target.value;
    const shouldAllow = handleNumericKeyPress(e, currentValue, metric);
    
    if (!shouldAllow) {
      e.preventDefault();
    }
  };
};
