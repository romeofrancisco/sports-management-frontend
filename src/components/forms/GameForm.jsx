import React from "react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { convertToFormData } from "@/utils/convertToFormData";
import useFilteredTeams from "@/hooks/useFilteredTeams";
import { useCreateGame, useUpdateGame } from "@/hooks/useGames";
import { GAME_TYPES, GAME_TYPE_VALUES } from "@/constants/game";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import ControlledSelect from "../common/ControlledSelect";
import ControlledInput from "../common/ControlledInput";
import ControlledTeamSelect from "../common/ControlledTeamSelect";
import { ControlledDateTimePicker } from "../common/ControlledDateTimePicker";

const GameForm = ({ sports, teams, onClose, game = null, isLeagueGame = false }) => {
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
      sport: isEdit ? String(game.sport) : null,
      type: isEdit ? game.type : (isCoach() ? GAME_TYPE_VALUES.PRACTICE : null),
      home_team_id: isEdit ? game.home_team.id : null,
      away_team_id: isEdit ? game.away_team.id : null,
      date: isEdit ? (game.date ? new Date(game.date) : null) : null,
      location: isEdit ? game.location : null,
    },
  });  // Watch values for dynamic filtering
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
  };  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 py-4">
      {/* League Game Notice */}
      {isEdit && isLeagueGame && (
        <div className="bg-primary/20 border border-primary/50 rounded-lg p-3 mb-2">
          <p className="text-sm text-primary">
            <strong>League Game:</strong> Only date and venue can be modified for league games. 
            Teams and sport are fixed by the league schedule.
          </p>
        </div>
      )}

      {/* Sport */}
      <ControlledSelect
        name="sport"
        control={control}
        label="Sport"
        placeholder="Select sport"
        options={sports}
        valueKey="id"
        labelKey="name"
        groupLabel="Sports"
        disabled={isEdit || (isEdit && isLeagueGame)}
        errors={errors}
      />



      {/* Home Team Selector */}
      <ControlledTeamSelect
        name="home_team_id"
        control={control}
        label="Home Team"
        placeholder="Select home team"
        teams={availableTeams}
        excludeTeamId={selectedAwayTeam}
        errors={errors}
        disabled={isEdit && isLeagueGame}
      />

      {/* Away Team Selector */}
      <ControlledTeamSelect
        name="away_team_id"
        control={control}
        label="Away Team"
        placeholder="Select away team"
        teams={availableTeams}
        excludeTeamId={selectedHomeTeam}
        errors={errors}
        disabled={isEdit && isLeagueGame}
      />

      {/* Date */}
      <ControlledDateTimePicker
        control={control}
        name="date"
        label="Date"
        placeholder="Select date and time"
        errors={errors}
        className="w-full"
      />      {/* Location */}
      <ControlledInput
        name="location"
        control={control}
        label="Location"
        placeholder="Enter game location"
        errors={errors}
      />

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