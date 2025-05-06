import React, { useState, useEffect, useRef } from "react";
import { format, addDays, subDays, isSameDay, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * DateNavigationBar - A reusable component for date selection with a horizontal interface
 * 
 * @param {Object} props
 * @param {Date} props.selectedDate - The currently selected date
 * @param {Function} props.onDateChange - Callback when a date is selected
 * @param {Array} props.data - Optional array of data to filter by dates
 * @param {Function} props.getDataCountForDate - Optional function to get count of data items for a date
 * @param {string} props.dateProperty - Optional property name in data objects that contains the date (default: 'date')
 * @param {string} props.countLabel - Label to use for the count badge (default: 'Game')
 * @param {string} props.className - Optional additional class names
 */
const DateNavigationBar = ({
  selectedDate = new Date(),
  onDateChange,
  data = [],
  getDataCountForDate,
  dateProperty = 'date',
  countLabel = 'Game',
  className,
}) => {
  const [visibleDates, setVisibleDates] = useState([]);
  const isMobile = useIsMobile();
  
  // Set responsive number of dates to display
  const visibleDatesCount = isMobile ? 3 : 5;
  
  // Generate array of dates to display in the date selector
  useEffect(() => {
    const dates = [];
    
    // Calculate how many dates to show before and after
    const daysBeforeSelected = Math.floor(visibleDatesCount / 2);
    const daysAfterSelected = visibleDatesCount - daysBeforeSelected - 1;
    
    // Generate dates
    for (let i = -daysBeforeSelected; i <= daysAfterSelected; i++) {
      dates.push(addDays(selectedDate, i));
    }

    setVisibleDates(dates);
  }, [selectedDate, visibleDatesCount, isMobile]);

  // Navigate to previous/next date
  const navigateDate = (direction) => {
    const newDate = direction === "next" 
      ? addDays(selectedDate, 1) 
      : subDays(selectedDate, 1);
    
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  // Default implementation to count data items for a date if not provided
  const defaultGetDataCountForDate = (date) => {
    if (!data || data.length === 0) return 0;
    
    return data.filter(item => {
      if (!item[dateProperty]) return false;
      const itemDate = typeof item[dateProperty] === 'string' 
        ? parseISO(item[dateProperty]) 
        : item[dateProperty];
      return isSameDay(itemDate, date);
    }).length;
  };

  // Use provided function or default implementation
  const getCount = getDataCountForDate || defaultGetDataCountForDate;

  return (
    <div className={cn(
      "w-full border rounded-lg bg-muted/50",
      className
    )}>
      <div className="flex items-center">
        {/* Previous button */}
        <button
          className="h-20 rounded-l-lg w-8 sm:w-12 flex items-center justify-center hover:bg-muted/50"
          onClick={() => navigateDate("prev")}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Dates container - using CSS Grid for equal width columns */}
        <div className={`grid grid-cols-${visibleDatesCount} flex-1`}>
          {visibleDates.map((date, i) => {
            const isSelected = isSameDay(date, selectedDate);
            const itemsCount = getCount(date);
            const dayOfWeek = format(date, "EEE").toUpperCase();
            const monthName = format(date, "MMM");
            const dayNum = format(date, "d");

            return (
              <div
                key={date.toISOString()}
                data-selected={isSelected}
                className={cn(
                  "flex flex-col items-center justify-center py-2 cursor-pointer transition-colors",
                  isSelected ? "bg-primary text-white" : "hover:bg-muted/50"
                )}
                onClick={() => onDateChange && onDateChange(date)}
              >
                {/* Day of week */}
                <div className="text-xs sm:text-sm font-medium">
                  {dayOfWeek}
                </div>
                
                {/* Month and day */}
                <div className="text-xs sm:text-sm font-bold mt-0.5">
                  {monthName} {dayNum}
                </div>
                
                {/* Game count */}
                {itemsCount > 0 && (
                  <div className="text-[9px] sm:text-xs mt-0.5">
                    {`${itemsCount} ${itemsCount === 1 ? countLabel : `${countLabel}s`}`}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Next button */}
        <button
          className="h-20 rounded-r-xl w-8 sm:w-12 flex items-center justify-center hover:bg-muted/50"
          onClick={() => navigateDate("next")}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export { DateNavigationBar };