import { Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

const ControlledCheckbox = ({
  name,
  control,
  label,
  help_text = "",
  image,
  errors,
  className = "",
  ...rest
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className={`flex space-x-2 ${image ? "items-center" : "items-start"}`}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
              {...rest}
            />
          )}
        />
        <div className="flex items-center gap-2">
          {image && (
            <Avatar>
              <AvatarImage src={image} alt={label} />
              <AvatarFallback>{label[0]}</AvatarFallback>
            </Avatar>
          )}
          <div className="flex flex-col">
            {label && (
              <Label className="text-sm font-medium mb-1 leading-none">
                {label}
              </Label>
            )}
            {help_text && (
              <span className="text-muted-foreground font-medium text-xs">
                {help_text}
              </span>
            )}
          </div>
        </div>
      </div>
      {errors?.[name] && (
        <p className="text-xs text-left text-destructive">
          {errors[name].message}
        </p>
      )}
    </div>
  );
};

export default ControlledCheckbox;
