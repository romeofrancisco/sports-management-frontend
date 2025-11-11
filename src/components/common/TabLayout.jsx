import React from "react";
import { cn } from "@/lib/utils";

/**
 * Common layout wrapper for all training dashboard tabs
 * Provides consistent spacing, padding, and responsive design
 */
const TabLayout = ({
  children,
  className,
  variant = "default", // 'default' | 'fullscreen'
}) => {
  return (
    <div
      className={cn(
        "w-full h-full",
        variant === "fullscreen" ? "p-0" : "p-4 sm:p-6",
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Header component for tab content
 */
const TabHeader = ({ title, description, actions, className, icon: Icon }) => {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6",
        className
      )}
    >
      <div className="flex items-center flex-1 gap-2 min-w-0">
        {Icon && (
          <div className="bg-primary p-3 rounded-xl">
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
        )}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground truncate">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          {actions}
        </div>
      )}
    </div>
  );
};

/**
 * Content wrapper for tab body
 */
const TabContent = ({
  children,
  className,
  spacing = "default", // 'tight' | 'default' | 'loose'
}) => {
  const spacingClasses = {
    tight: "space-y-4",
    default: "space-y-6",
    loose: "space-y-8",
  };

  return (
    <div className={cn(spacingClasses[spacing], className)}>{children}</div>
  );
};

/**
 * Card wrapper for content sections
 */
const TabCard = ({
  children,
  className,
  padding = "default", // 'none' | 'small' | 'default' | 'large'
}) => {
  const paddingClasses = {
    none: "p-0",
    small: "p-3 sm:p-4",
    default: "p-4 sm:p-6",
    large: "p-6 sm:p-8",
  };

  return (
    <div
      className={cn(
        "rounded-lg border bg-card shadow-sm",
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Loading state component
 */
const TabLoading = ({ message = "Loading..." }) => {
  return (
    <TabLayout>
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-600 dark:text-slate-400 font-medium">
          {message}
        </p>
      </div>
    </TabLayout>
  );
};

/**
 * Error state component
 */
const TabError = ({
  title = "Error",
  message = "Something went wrong. Please try again.",
  onRetry,
}) => {
  return (
    <TabLayout>
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </TabLayout>
  );
};

// Compound component pattern
TabLayout.Header = TabHeader;
TabLayout.Content = TabContent;
TabLayout.Card = TabCard;
TabLayout.Loading = TabLoading;
TabLayout.Error = TabError;

export { TabLayout, TabHeader, TabContent, TabCard, TabLoading, TabError };
export default TabLayout;
