import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const ControlledInput = ({
  name,
  control,
  label,
  type = "text",
  help_text = "",
  accept,
  placeholder,
  errors,
  optional = false,
  className = "",
  rules,
  ...rest
}) => {
  return (
    <div className={`grid gap-1 ${className}`}>
      <div className="flex flex-col">
        {label && (
          <Label htmlFor={name} className="text-sm text-left">
            {label} {!optional && <span className="text-destructive">*</span>}
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
        rules={rules}
        render={({ field }) => {
          const inputProps = {
            id: name,
            type,
            accept,
            placeholder,
            onChange: (e) =>
              type === "file"
                ? field.onChange(e.target.files)
                : field.onChange(e.target.value),
            ...(type === "password" && { autoComplete: "off" }),
            ...rest,
          };

          if (type !== "file") {
            inputProps.value = field.value ?? "";
          }

          return <Input {...inputProps} />;
        }}
      />
      {errors?.[name] && (
        <p className="text-xs text-left text-destructive">
          {errors[name].message}
        </p>
      )}
    </div>
  );
};

export default ControlledInput;
