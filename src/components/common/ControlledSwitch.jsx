import React from 'react';
import { Controller } from 'react-hook-form';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

/**
 * A controlled Switch component for use with react-hook-form
 * 
 * @param {Object} props
 * @param {string} props.name - Field name for react-hook-form
 * @param {Object} props.control - Control from react-hook-form
 * @param {string} props.label - Field label
 * @param {string} props.help_text - Helper text below label
 * @param {Object} props.errors - Errors object from react-hook-form
 * @param {string} props.className - Additional CSS classes
 */
const ControlledSwitch = ({
  name,
  control,
  label,
  help_text = "",
  errors,
  className = "",
}) => {
  return (
    <div className={`grid gap-1 ${className}`}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              {label && (
                <Label className="text-sm font-medium">{label}</Label>
              )}
              {help_text && (
                <p className="text-xs text-muted-foreground">{help_text}</p>
              )}
            </div>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
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

export default ControlledSwitch;
