import React from 'react';
import { Button } from '../ui/button';

/**
 * Reusable pagination component
 * 
 * @param {Object} props
 * @param {number} props.currentPage - Current page number
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.onPageChange - Function to handle page change
 * @param {string} props.className - Optional additional class names
 */
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = '' 
}) => {
  if (totalPages <= 1) return null;
  
  return (
    <div className={`flex justify-center items-center mt-4 ${className}`}>
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mr-2"
      >
        Previous
      </Button>
      <span className="mx-4 py-2">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="ml-2"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
