import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ControlledTextarea = ({
  name,
  control,
  label,
  help_text = "",
  placeholder,
  errors,
  className = "",
  ...rest
}) => {
  return (
    <div className={`grid gap-1 ${className}`}>
      <div className="flex flex-col">
        {label && (
          <Label htmlFor={name} className="text-sm text-left">
            {label}
          </Label>
        )}
        {help_text && (
          <span className="text-start text-muted-foreground text-xs">
            {help_text}
          </span>
        )}
      </div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Textarea
            id={name}
            placeholder={placeholder}
            value={field.value ?? ""}
            onChange={field.onChange}
            {...rest}
            className="max-h-52 resize-y"
          />
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

export default ControlledTextarea;
