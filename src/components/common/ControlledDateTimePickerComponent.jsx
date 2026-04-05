import { Controller } from "react-hook-form";
import { DateTimePicker } from "./DateTimePicker";

const ControlledDateTimePicker = ({
  name,
  control,
  label,
  type = "date",
  help_text = "",
  placeholder,
  errors,
  className = "",
  rules,
  disabled = false,
}) => {

  return (
    <div className={`grid gap-1 ${className}`}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <DateTimePicker
            id={name}
            label={label}
            type={type}
            help_text={help_text}
            placeholder={placeholder}
            value={field.value}
            onChange={field.onChange}
            error={errors?.[name]?.message}
            disabled={disabled}
          />
        )}
      />
    </div>
  );
};

export default ControlledDateTimePicker;
