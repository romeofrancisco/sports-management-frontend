import React from 'react';
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

const SimpleCheckbox = ({ checked, onChange, id, className, ...props }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onChange?.(!checked);
  };

  return (
    <button
      type="button"
      id={id}
      className={cn(
        "inline-flex items-center justify-center size-4 shrink-0 rounded-[4px] border border-input shadow-xs transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        checked 
          ? "bg-primary text-primary-foreground border-primary" 
          : "bg-background hover:bg-muted",
        className
      )}
      onClick={handleClick}
      aria-checked={checked}
      role="checkbox"
      tabIndex={0}
      {...props}
    >
      {checked && (
        <CheckIcon className="size-3.5" />
      )}
    </button>
  );
};

export default SimpleCheckbox;
