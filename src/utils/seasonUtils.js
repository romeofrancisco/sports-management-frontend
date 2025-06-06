/**
 * Shared utility functions for season components
 */

/**
 * Get status color class based on season status
 * @param {string} status - The season status
 * @returns {string} - The corresponding color class
 */
export const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'ACTIVE':
    case 'ONGOING':
      return 'text-green-600 bg-green-50';
    case 'COMPLETED':
    case 'FINISHED':
      return 'text-blue-600 bg-blue-50';
    case 'UPCOMING':
    case 'SCHEDULED':
      return 'text-yellow-600 bg-yellow-50';
    case 'CANCELLED':
    case 'SUSPENDED':
      return 'text-red-600 bg-red-50';
    case 'DRAFT':
    case 'PLANNING':
      return 'text-gray-600 bg-gray-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

/**
 * Format date to a readable string
 * @param {string|Date} date - The date to format
 * @param {Object} options - Formatting options
 * @returns {string} - The formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return 'N/A';
  
  const {
    includeTime = false,
    shortFormat = false,
    relative = false
  } = options;
  
  try {
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    if (relative) {
      const now = new Date();
      const diffInMs = dateObj.getTime() - now.getTime();
      const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return 'Today';
      if (diffInDays === 1) return 'Tomorrow';
      if (diffInDays === -1) return 'Yesterday';
      if (diffInDays > 0) return `In ${diffInDays} days`;
      if (diffInDays < 0) return `${Math.abs(diffInDays)} days ago`;
    }
    
    const formatOptions = {
      year: 'numeric',
      month: shortFormat ? 'short' : 'long',
      day: 'numeric',
    };
    
    if (includeTime) {
      formatOptions.hour = '2-digit';
      formatOptions.minute = '2-digit';
    }
    
    return dateObj.toLocaleDateString('en-US', formatOptions);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Get status badge classes for consistent styling
 * @param {string} status - The status to style
 * @returns {string} - Combined badge classes
 */
export const getStatusBadgeClasses = (status) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const colorClasses = getStatusColor(status);
  return `${baseClasses} ${colorClasses}`;
};

/**
 * Check if a season is currently active
 * @param {Object} season - The season object
 * @returns {boolean} - Whether the season is active
 */
export const isSeasonActive = (season) => {
  if (!season) return false;
  
  const status = season.status?.toUpperCase();
  const now = new Date();
  const startDate = season.start_date ? new Date(season.start_date) : null;
  const endDate = season.end_date ? new Date(season.end_date) : null;
  
  // Check status first
  if (status === 'ACTIVE' || status === 'ONGOING') {
    return true;
  }
  
  // Check date range if available
  if (startDate && endDate) {
    return now >= startDate && now <= endDate;
  }
  
  return false;
};

/**
 * Get season progress percentage
 * @param {Object} season - The season object
 * @returns {number} - Progress percentage (0-100)
 */
export const getSeasonProgress = (season) => {
  if (!season || !season.start_date || !season.end_date) {
    return 0;
  }
  
  const startDate = new Date(season.start_date);
  const endDate = new Date(season.end_date);
  const now = new Date();
  
  if (now < startDate) return 0;
  if (now > endDate) return 100;
  
  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsed = now.getTime() - startDate.getTime();
  
  return Math.round((elapsed / totalDuration) * 100);
};
