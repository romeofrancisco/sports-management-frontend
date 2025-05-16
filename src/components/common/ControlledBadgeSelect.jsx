import React from 'react';
import { Controller } from 'react-hook-form';
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

/**
 * A controlled component for selecting badges
 * 
 * @param {Object} props
 * @param {string} props.name - Field name for react-hook-form
 * @param {Object} props.control - Control from react-hook-form
 * @param {string} props.label - Field label
 * @param {Array} props.options - Options array of objects with id, name, color
 * @param {string} props.help_text - Helper text below label
 * @param {Object} props.errors - Errors object from react-hook-form
 * @param {string} props.className - Additional CSS classes
 */
const ControlledBadgeSelect = ({
  name,
  control,
  label,
  options = [],
  help_text = "",
  errors,
  className = "",
}) => {
  return (
    <div className={`grid gap-1 ${className}`}>
      {label && (
        <Label htmlFor={name} className="text-sm text-left">
          {label}
        </Label>
      )}
      {help_text && (
        <span className="text-xs text-muted-foreground">
          {help_text}
        </span>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex flex-wrap gap-2 mt-2">
            {options.map(option => (
              <Badge
                key={option.id}
                variant={field.value?.includes(option.id) ? "default" : "outline"}
                className="cursor-pointer"
                style={{
                  backgroundColor: field.value?.includes(option.id) ? option.color : 'transparent',
                  borderColor: option.color,
                  color: field.value?.includes(option.id) ? 'white' : undefined
                }}
                onClick={() => {
                  const newValue = field.value?.includes(option.id)
                    ? field.value.filter(id => id !== option.id)
                    : [...(field.value || []), option.id];
                  field.onChange(newValue);
                }}
              >
                {option.name}
              </Badge>
            ))}
          </div>
        )}
      />
      {errors?.[name] && (
        <p className="text-xs text-left text-destructive">
          {errors[name].message}
        </p>
      )}
    </div>
  );
};

export default ControlledBadgeSelect;
