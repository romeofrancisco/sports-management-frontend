import React from "react";
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
import { useCreateGame, useUpdateGame } from "@/hooks/useGames";
import { Loader2 } from "lucide-react";
import { convertToFormData } from "@/utils/convertToFormData";
import useFilteredTeams from "@/hooks/useFilteredTeams";
import { ControlledDateTimePicker } from "../common/ControlledDateTimePicker";
import { GAME_TYPES, GAME_TYPE_VALUES } from "@/constants/game";
import { useRolePermissions } from "@/hooks/useRolePermissions";

const GameForm = ({ sports, teams, onClose, game = null }) => {
  const isEdit = !!game;
  const { permissions, isAdmin, isCoach } = useRolePermissions();
  const { mutate: createGame, isPending: isCreating } = useCreateGame();
  const { mutate: updateGame, isPending: isUpdating } = useUpdateGame(game?.id);
  const isPending = isCreating || isUpdating;

  // Filter game types based on user role
  const getAvailableGameTypes = () => {
    if (isAdmin()) {
      return GAME_TYPES; // Admins can create any type of game
    } else if (isCoach()) {
      return GAME_TYPES.filter(type => type.value === GAME_TYPE_VALUES.PRACTICE); // Coaches can only create practice games
    }
    return [];
  };

  const availableGameTypes = getAvailableGameTypes();

  const { control, handleSubmit, formState: { errors }, watch, setError } = useForm({
    defaultValues: {
      sport: isEdit ? String(game.sport) : "",
      type: isEdit ? game.type : (isCoach() ? GAME_TYPE_VALUES.PRACTICE : ""),
      home_team_id: isEdit ? String(game.home_team.id) : "",
      away_team_id: isEdit ? String(game.away_team.id) : "",
      date: isEdit ? (game.date ? new Date(game.date) : null) : null,
      location: isEdit ? game.location : "",
      status: isEdit ? game.status : "scheduled",
    },
  });
  // Watch values for dynamic filtering
  const selectedSport = watch("sport");
  const selectedHomeTeam = watch("home_team_id");
  const selectedAwayTeam = watch("away_team_id");

  const filteredTeams = useFilteredTeams(teams, sports, selectedSport);
  
  // Additional filtering for coaches - they can only create games involving their teams
  const getAvailableTeams = () => {
    if (isAdmin()) {
      return filteredTeams; // Admins can use any teams
    } else if (isCoach()) {
      // Coaches can only select teams they coach
      return filteredTeams.filter(team => permissions.teams.edit(team));
    }
    return filteredTeams;
  };

  const availableTeams = getAvailableTeams();

  const onSubmit = (data) => {
    const formData = convertToFormData(data);
    
    const mutationFn = isEdit ? updateGame : createGame;

    mutationFn(formData, {
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
            <Select 
              onValueChange={field.onChange} 
              value={field.value} 
              disabled={isEdit}
            >
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
          </p>        )}
      </div>

      {/* Game Type */}
      <div className="grid gap-1">
        <Label className="text-sm text-left">Game Type</Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select 
              onValueChange={field.onChange} 
              value={field.value}
              disabled={isEdit || (isCoach() && availableGameTypes.length === 1)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select game type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Game Types</SelectLabel>
                  {availableGameTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.type && (
          <p className="text-xs text-left text-destructive">
            {errors.type.message}
          </p>
        )}
      </div>      {/* Home Team Selector */}
      <TeamSelect
        control={control}
        name="home_team_id"
        label="Home Team"
        placeholder="Select home team"
        teams={availableTeams}
        excludeTeamId={selectedAwayTeam}
        errorMessage={errors.home_team_id?.message}
      />

      {/* Away Team Selector */}
      <TeamSelect
        control={control}
        name="away_team_id"
        label="Away Team"
        placeholder="Select away team"
        teams={availableTeams}
        excludeTeamId={selectedHomeTeam}
        errorMessage={errors.away_team_id?.message}
      />

      {/* Date */}
      <ControlledDateTimePicker
        control={control}
        name="date"
        label="Date"
        placeholder="Select date and time"
        errors={errors}
        className="w-full"
      />

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
            <Loader2 className="animate-spin mr-2" />
            Please wait
          </>
        ) : isEdit ? (
          "Update Game"
        ) : (
          "Schedule Game"
        )}
      </Button>
    </form>
  );
};

export default GameForm;