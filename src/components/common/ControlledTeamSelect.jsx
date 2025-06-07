import React from "react";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectGroup,
  SelectItem,
} from "../ui/select";

const ControlledTeamSelect = ({
  name,
  control,
  label,
  placeholder = "Select a team",
  teams = [],
  excludeTeamId = null,
  errors,
  disabled = false,
  helperText,
  className = "",
}) => {
  // Filter out excluded team
  const availableTeams = teams.filter(
    (team) => String(team.id) !== String(excludeTeamId)
  );

  return (
    <div className={`grid gap-1 ${className}`}>
      {label && (
        <Label htmlFor={name} className="text-sm text-left">
          {label}
        </Label>
      )}
      
      {helperText && (
        <span className="text-xs text-muted-foreground">
          {helperText}
        </span>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (          <Select
            value={field.value ? String(field.value) : ""}
            onValueChange={field.onChange}
            disabled={disabled || availableTeams.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Teams</SelectLabel>
                {availableTeams.map((team) => (
                  <SelectItem key={team.id} value={String(team.id)}>
                    <div className="grid text-start">
                      {team.name}
                      {team.sport && (
                        <span className="text-xs text-muted-foreground">
                          {team.sport.name}
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

export default ControlledTeamSelect;
