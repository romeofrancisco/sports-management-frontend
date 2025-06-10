import React from 'react';
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

const DebugCheckbox = ({ checked, onCheckedChange, id, className, ...props }) => {
  console.log(`🟨 DebugCheckbox rendering - id: ${id}, checked: ${checked}`);
  
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`🟨 DebugCheckbox clicked - id: ${id}, current checked: ${checked}, will toggle to: ${!checked}`);
    onCheckedChange?.(!checked);
  };

  return (
    <button
      {...props}
      id={id}
      type="button"
      className={cn(
        "peer border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer flex items-center justify-center",
        checked && "bg-primary text-primary-foreground border-primary",
        !checked && "bg-background",
        className
      )}
      onClick={handleClick}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleClick(e);
        }
      }}
    >
      {checked && <CheckIcon className="size-3.5" />}
    </button>
  );
};

export default DebugCheckbox;
