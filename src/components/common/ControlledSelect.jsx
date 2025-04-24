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
}) => {
  return (
    <div className={`grid gap-0.5 ${className}`}>
      {label && (
        <Label htmlFor={name} className="text-sm text-left">
          {label}
        </Label>
      )}
      <span className="text-xs text-muted-foreground font-medium">
        {help_text}
      </span>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select value={String(field.value)} onValueChange={field.onChange}>
            <SelectTrigger className="w-full" size={size}>
              <SelectValue placeholder={placeholder} />
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
                      {opt[labelKey]}{" "}
                      <span className="text-xs text-muted-foreground">
                        {opt[secondaryLabel]}
                      </span>
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
