import React, { useMemo } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useForm } from "react-hook-form";
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
import { TeamSelect } from "../common/TeamSelect";
import { DateTimePicker } from "../ui/date-time-picker";
import { useCreateGame } from "@/hooks/useGames";
import { Loader2 } from "lucide-react";
import useFilteredTeams from "@/hooks/useFilteredTeams";
import { convertToFormData } from "@/utils/convertToFormData";

const CreateGameForm = ({ sports, teams, onClose }) => {
  const { mutate: createGame, isPending } = useCreateGame();
  const { control, handleSubmit, formState: { errors }, watch, setError, } = useForm({
    defaultValues: {
      sport: "",
      home_team_id: "",
      away_team_id: "",
      date: null,
      location: "",
      status: "scheduled",
    },
  });

  // Watch values for dynamic filtering.
  const selectedSport = watch("sport");
  const selectedHomeTeam = watch("home_team_id");
  const selectedAwayTeam = watch("away_team_id");

  const filteredTeams = useFilteredTeams(teams, sports, selectedSport);

  const onSubmit = (gameData) => {
    console.log(gameData)
    const formData = convertToFormData(gameData);

    createGame(formData, {
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
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 py-4">
      {/* Sport */}
      <div className="grid gap-1">
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

      {/* Home Team Selector */}
      <TeamSelect
        control={control}
        name="home_team_id"
        label="Home Team"
        placeholder="Select home team"
        teams={filteredTeams}
        excludeTeamId={selectedAwayTeam}
        errorMessage={errors.home_team_id?.message}
      />

      {/* Away Team Selector */}
      <TeamSelect
        control={control}
        name="away_team_id"
        label="Away Team"
        placeholder="Select away team"
        teams={filteredTeams}
        excludeTeamId={selectedHomeTeam}
        errorMessage={errors.away_team_id?.message}
      />

      {/* Date */}
      <div className="grid gap-1">
        <Label className="text-sm text-left">Date</Label>
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DateTimePicker
              {...field}
              granularity="minute"
              hourCycle={12}
              onChange={(value) => field.onChange(value)}
            />
          )}
        />
        {errors.date && (
          <p className="text-xs text-left text-destructive">
            {errors.date.message}
          </p>
        )}
      </div>

      {/* Location */}
      <div className="grid gap-1">
        <Label className="text-sm text-left">Location</Label>
        <Controller
          name="location"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
        {errors.location && (
          <p className="text-xs text-left text-destructive">
            {errors.location.message}
          </p>
        )}
      </div>

      <Button type="submit" className="mt-4" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="animate-spin" />
            Please wait
          </>
        ) : (
          "Schedule Game"
        )}
      </Button>
    </form>
  );
};

export default CreateGameForm;
