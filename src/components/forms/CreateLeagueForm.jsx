import { Label } from "@radix-ui/react-dropdown-menu";
import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectGroup,
  SelectItem,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Avatar } from "../ui/avatar";
import { AvatarImage } from "../ui/avatar";
import { useCreateLeague } from "@/hooks/useLeagues";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { convertToFormData } from "@/utils/convertToFormData";

// TeamSelection Component
const TeamSelection = ({
  sportTeams,
  selectedTeams,
  handleToggleAllTeams,
  handleToggleTeam,
  error,
}) => (
  <div className="border-y py-2">
    <div className="flex items-center gap-2 mb-2 border-b py-1">
      <Checkbox
        checked={
          sportTeams.length > 0 && selectedTeams.length === sportTeams.length
        }
        onCheckedChange={handleToggleAllTeams}
      />
      <Label className="text-sm">Teams</Label>
      {error && (
      <p className="text-xs text-left text-destructive">{error.message}</p>
    )}
    </div>
    <div className="grid grid-cols-2 gap-3">
      {sportTeams.map((team) => (
        <div key={team.id} className="flex items-center gap-2">
          <Checkbox
            checked={selectedTeams.includes(team.id)}
            onCheckedChange={(checked) => handleToggleTeam(checked, team.id)}
          />
          <Avatar>
            <AvatarImage sizes="xs" src={team.logo} alt={team.name} />
          </Avatar>
          <span className="text-sm">{team.name}</span>
        </div>
      ))}
    </div>
  </div>
);

const CreateLeagueForm = ({ sports, teams, onClose }) => {
  const { mutate: createLeague, isPending } = useCreateLeague();
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      sport: "",
      teams: [],
    },
  });

  const selectedSport = watch("sport");
  const selectedTeams = watch("teams") || [];

  // Filter teams based on the selected sport
  const sportTeams = useMemo(
    () => teams.filter((team) => String(team.sport) === selectedSport),
    [teams, selectedSport]
  );

  // Clear selected teams when sport changes
  useEffect(() => {
    setValue("teams", []);
  }, [selectedSport, setValue]);

  const onSubmit = (data) => {
    const formData = convertToFormData(data)
    createLeague(formData, {
      onSuccess: () => {
        onClose();
      },
      onError: (e) => {
        const error = e.response.data;
        if (error) {
          Object.keys(error).forEach((fieldName) => {
            setError(fieldName, {
              type: "server",
              message: error[fieldName],
            });
          });
        }
      }
    });
  };

  const handleToggleAllTeams = (checked) => {
    setValue("teams", checked ? sportTeams.map((team) => team.id) : []);
  };

  const handleToggleTeam = (checked, teamId) => {
    setValue(
      "teams",
      checked
        ? [...selectedTeams, teamId]
        : selectedTeams.filter((id) => id !== teamId)
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 py-3 px-1">
      {/* League Name */}
      <div>
        <Label className="text-sm text-left">Name</Label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
        {errors.name && (
          <p className="text-xs text-left text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Sport Select */}
      <div>
        <Label className="text-sm text-left">Sport</Label>
        <Controller
          name="sport"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sports</SelectLabel>
                  {sports.map((sport) => (
                    <SelectItem key={sport.id} value={String(sport.id)}>
                      {sport.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.sport && (
          <p className="text-xs text-left text-destructive">
            {errors.sport.message}
          </p>
        )}
      </div>

      {/* Teams Selection */}
      {selectedSport && (
        <TeamSelection
          sportTeams={sportTeams}
          selectedTeams={selectedTeams}
          handleToggleAllTeams={handleToggleAllTeams}
          handleToggleTeam={handleToggleTeam}
          error={errors.teams}
        />
      )}

      <Button type="submit" className="mt-4" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="animate-spin mr-2" />
            Please wait
          </>
        ) : (
          "Create League"
        )}
      </Button>
    </form>
  );
};

export default CreateLeagueForm;
