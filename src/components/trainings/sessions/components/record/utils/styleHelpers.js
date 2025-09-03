import { cn } from "@/lib/utils";

/**
 * Helper function to get container classes
 */
export const getContainerClasses = (
  performanceStatus,
  hasValue,
  isFocused,
  isFormDisabled
) => {
  const baseClasses =
    "group relative rounded-2xl border-2 transition-colors duration-300 overflow-hidden";
  const disabledClasses = isFormDisabled ? "opacity-60 cursor-not-allowed" : "";

  if (performanceStatus) {
    return cn(
      baseClasses,
      performanceStatus.containerBg,
      performanceStatus.border,
      disabledClasses
    );
  }

  if (hasValue || isFocused) {
    return cn(
      baseClasses,
      "bg-gradient-to-r from-primary/5 to-primary/10 border-2 border-primary/20 shadow-lg shadow-primary/5",
      disabledClasses
    );
  }

  return cn(
    baseClasses,
    "bg-gradient-to-r from-muted/30 to-muted/50 hover:from-primary/5 hover:to-primary/10 border-border/60 hover:border-primary/20 hover:shadow-md",
    disabledClasses
  );
};

/**
 * Helper function to get input container border classes
 */
export const getInputBorderClasses = (
  performanceStatus,
  hasValue,
  isFocused
) => {
  const baseClasses =
    "flex items-stretch rounded-xl overflow-hidden border-2 focus-within:ring-2 shadow-sm transition-colors duration-300";

  if (performanceStatus) {
    return cn(
      baseClasses,
      performanceStatus.inputBorder,
      performanceStatus.focusRing,
      performanceStatus.focusBorder
    );
  }

  if (hasValue || isFocused) {
    return cn(
      baseClasses,
      "border-primary/30 focus-within:ring-primary/20 dark:focus-within:ring-primary/10"
    );
  }

  return cn(
    baseClasses,
    "border-border focus-within:ring-primary/20 dark:focus-within:ring-primary/10"
  );
};

/**
 * Helper function to get input text classes
 */
export const getInputTextClasses = (performanceStatus) => {
  const baseClasses =
    "text-lg sm:text-xl font-semibold h-10 sm:h-12 border-0 bg-transparent focus:ring-0 focus:outline-none rounded-none px-4 sm:px-6 transition-colors duration-300";

  return cn(
    baseClasses,
    "text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
  );
};

/**
 * Helper function to get status indicator classes
 */
export const getStatusIndicatorClasses = (performanceStatus) => {
  const baseClasses =
    "w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shadow-sm transition-colors duration-300";

  if (performanceStatus) {
    return cn(baseClasses, performanceStatus.indicator);
  }

  return cn(baseClasses, "bg-primary");
};

/**
 * Helper function to get status text classes
 */
export const getStatusTextClasses = (performanceStatus) => {
  const baseClasses =
    "text-xs sm:text-sm font-semibold transition-colors duration-300";

  if (performanceStatus) {
    return cn(baseClasses, performanceStatus.color);
  }

  return cn(baseClasses, "text-primary");
};

/**
 * Helper function to get unit section classes
 */
export const getUnitSectionClasses = (
  performanceStatus,
  hasValue,
  isFocused
) => {
  const baseClasses =
    "px-3 sm:px-6 flex items-center justify-center min-w-[70px] sm:min-w-[90px] text-xs sm:text-sm font-bold uppercase tracking-wide transition-colors duration-300";

  if (performanceStatus) {
    return cn(
      baseClasses,
      performanceStatus.unitBg,
      performanceStatus.unitText,
      "border-l",
      performanceStatus.unitBorder
    );
  }

  if (hasValue || isFocused) {
    return cn(
      baseClasses,
      "bg-primary/10 text-primary border-l border-primary/20"
    );
  }

  return cn(
    baseClasses,
    "bg-muted/30 text-muted-foreground border-l border-border"
  );
};

/**
 * Helper function to get textarea classes
 */
export const getTextareaClasses = (performanceStatus, notes) => {
  const baseClasses =
    "resize-none min-h-[115px] rounded-xl border-2 text-sm leading-relaxed p-3 sm:p-4 shadow-sm transition-colors duration-300 placeholder:text-muted-foreground/70 dark:placeholder:text-muted-foreground/50 placeholder:text-sm";

  if (notes) {
    return cn(
      baseClasses,
      "focus-visible:ring-0 bg-secondary/20 dark:bg-secondary/10 border-primary/20"
    );
  }

  return cn(
    baseClasses,
    "focus-visible:ring-0 border-border hover:border-primary/30"
  );
};
