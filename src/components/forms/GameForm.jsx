import React from "react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { convertToFormData } from "@/utils/convertToFormData";
import useFilteredTeams from "@/hooks/useFilteredTeams";
import { useCreateGame, useUpdateGame } from "@/hooks/useGames";
import { GAME_TYPES, GAME_TYPE_VALUES } from "@/constants/game";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import ControlledSelect from "../common/ControlledSelect";
import ControlledInput from "../common/ControlledInput";
import ControlledTeamSelect from "../common/ControlledTeamSelect";
import ControlledDateTimePicker from "../common/ControlledDateTimePickerComponent";

const GameForm = ({
  sports,
  teams,
  onClose,
  game = null,
  isLeagueGame = false,
}) => {
  const isEdit = !!game;
  const { permissions, isAdmin, isCoach } = useRolePermissions();
  const { mutate: createGame, isPending: isCreating } = useCreateGame();
  const { mutate: updateGame, isPending: isUpdating } = useUpdateGame(game?.id);
  const isPending = isCreating || isUpdating;

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      sport: isEdit ? String(game.sport) : null,
      home_team_id: isEdit ? game.home_team.id : null,
      away_team_id: isEdit ? game.away_team.id : null,
      date: isEdit
        ? game.date
          ? format(new Date(game.date), "yyyy-MM-dd")
          : ""
        : format(new Date(), "yyyy-MM-dd"),
      time: isEdit
        ? game.time ||
          (game.date ? format(new Date(game.date), "HH:mm") : "15:00")
        : "15:00",
      location: isEdit ? game.location : null,
    },
  }); // Watch values for dynamic filtering
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
      return filteredTeams.filter((team) => permissions.teams.edit(team));
    }
    return filteredTeams;
  };

  const availableTeams = getAvailableTeams();

  const onSubmit = (data) => {
    // Clear any existing errors before submission
    clearErrors();

    // Format the data properly for the backend
    const formattedData = {
      ...data,
      date: data.date || null, // Keep date as YYYY-MM-DD format
      time: data.time || null, // Keep time as HH:mm format
    };

    const formData = convertToFormData(formattedData);

    const mutationFn = isEdit ? updateGame : createGame;

    const handleError = (err) => {
      console.error("Game operation error:", err);

      const errorData = err.response?.data;
      if (errorData && typeof errorData === "object") {
        // Handle field-specific errors
        Object.entries(errorData).forEach(([field, message]) => {
          let errorMessage = message;

          // Handle different error message formats
          if (Array.isArray(message)) {
            errorMessage = message[0];
          } else if (typeof message === "object" && message.message) {
            errorMessage = message.message;
          }

          setError(field, {
            type: "server",
            message: errorMessage,
          });
        });
      } else {
        // Handle generic errors
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "An error occurred. Please try again.";

        setError("root", {
          type: "server",
          message: errorMessage,
        });
      }
    };

    mutationFn(formData, {
      onSuccess: () => {
        onClose();
      },
      onError: handleError,
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 py-4">
      {/* Display general form errors */}
      {errors.root && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          <p className="text-sm font-medium">{errors.root.message}</p>
        </div>
      )}

      {/* League Game Notice */}
      {isEdit && isLeagueGame && (
        <div className="bg-primary/20 border border-primary/50 rounded-lg p-3 mb-2">
          <p className="text-sm text-primary">
            <strong>League Game:</strong> Only date and venue can be modified
            for league games. Teams and sport are fixed by the league schedule.
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
        rules={{ required: "Sport is required" }}
        errors={errors}
      />

      {/* Home Team Selector */}
      <ControlledTeamSelect
        name="home_team_id"
        control={control}
        label="Home Team"
        placeholder={selectedSport ? "Select home team" : "Select sport first"}
        teams={availableTeams}
        excludeTeamId={selectedAwayTeam}
        rules={{ required: "Home team is required" }}
        errors={errors}
        disabled={!selectedSport || (isEdit && isLeagueGame)}
        searchPlaceholder="Search home teams..."
      />

      {/* Away Team Selector */}
      <ControlledTeamSelect
        name="away_team_id"
        control={control}
        label="Away Team"
        placeholder={selectedSport ? "Select away team" : "Select sport first"}
        teams={availableTeams}
        excludeTeamId={selectedHomeTeam}
        rules={{
          required: "Away team is required",
          validate: (value) => {
            if (value && value === selectedHomeTeam) {
              return "Away team cannot be the same as home team";
            }
            return true;
          },
        }}
        errors={errors}
        disabled={!selectedSport || (isEdit && isLeagueGame)}
        searchPlaceholder="Search away teams..."
      />

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ControlledDateTimePicker
          control={control}
          name="date"
          label="Date"
          type="date"
          placeholder="Select date"
          rules={{
            required: "Date is required",
            validate: (value) => {
              if (value && new Date(value) < new Date().setHours(0, 0, 0, 0)) {
                return "Game date cannot be in the past";
              }
              return true;
            },
          }}
          errors={errors}
        />

        <ControlledDateTimePicker
          control={control}
          name="time"
          label="Time"
          type="time"
          placeholder="Select time"
          rules={{ required: "Time is required" }}
          errors={errors}
        />
      </div>

      {/* Location */}
      <ControlledInput
        name="location"
        control={control}
        label="Location"
        placeholder="Enter game location"
        rules={{
          required: "Location is required",
          minLength: {
            value: 2,
            message: "Location must be at least 2 characters",
          },
        }}
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
