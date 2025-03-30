import { Label } from "@radix-ui/react-dropdown-menu";
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
}) => {
  return (
    <div className="grid gap-1">
      <Label className="text-sm text-left">{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={!teams.length > 0}
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
      {errorMessage && (
        <p className="text-xs text-left text-destructive">{errorMessage}</p>
      )}
    </div>
  );
};
