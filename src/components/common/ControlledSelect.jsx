import { Controller } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const ControlledSelect = ({
  name,
  control,
  label,
  placeholder = "Select an option...",
  help_text = "",
  options = [],
  groupLabel = "",
  errors,
  className = "",
  valueKey = "value",
  secondaryLabel = "",
  labelKey = "label",
  size = "",
  disabled = false,
  rules,
  optional,
}) => {
  return (

    <div className={`grid gap-0.5 ${className}`}>
      {label && (
        <Label htmlFor={name} className="text-sm text-left">
          {label} {!optional && <span className="text-destructive">*</span>}
        </Label>
      )}
      <span className="text-xs text-muted-foreground font-medium">
        {help_text}
      </span>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <Select 
            value={field.value ? String(field.value) : ""} 
            onValueChange={field.onChange}
          >
            <SelectTrigger className="w-full" size={size} disabled={disabled}>
              <SelectValue placeholder={placeholder} className="truncate overflow-hidden whitespace-nowrap w-full" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {groupLabel && <SelectLabel>{groupLabel}</SelectLabel>}
                {options.map((opt) => (
                  
                  <SelectItem
                    key={String(opt[valueKey])}
                    value={String(opt[valueKey])}
                  >
                    <div className="grid text-start">
                      <span className="truncate overflow-hidden whitespace-nowrap w-full block">
                        {opt[labelKey]}
                      </span>
                      {opt[secondaryLabel] && (
                        <span className="text-xs text-muted-foreground truncate overflow-hidden whitespace-nowrap w-full block">
                          {opt[secondaryLabel]}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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

export default ControlledSelect;
