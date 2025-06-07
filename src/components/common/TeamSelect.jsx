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

export const TeamSelect = ({
  control,
  name,
  label,
  placeholder,
  teams = [],
  excludeTeamId = [],
  errorMessage,
  disabled = false,
  helperText,
}) => {
  return (
    <div className="grid gap-1">
      <Label htmlFor={name} className="text-sm text-left">
        {label}
      </Label><Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            value={field.value ? String(field.value) : ""}
            disabled={disabled || !teams.length > 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Teams</SelectLabel>
                {teams
                  .filter((team) => String(team.id) !== String(excludeTeamId))
                  .map((team) => (
                    <SelectItem key={team.id} value={String(team.id)}>
                      {team.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
      {errorMessage && (
        <p className="text-xs text-left text-destructive">{errorMessage}</p>
      )}
    </div>
  );
};
