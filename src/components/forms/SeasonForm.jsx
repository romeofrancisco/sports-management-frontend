import React from "react";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { Loader2, Info, Calendar, Users2 } from "lucide-react";

import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

import ControlledInput from "@/components/common/ControlledInput";
import { ControlledDateRangePicker } from "@/components/common/ControlledDateRangePicker";

import { useCreateSeason, useUpdateSeason } from "@/hooks/useSeasons";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { useParams } from "react-router";

const SeasonForm = ({ teams, onClose, season = null }) => {
  const { league } = useParams();
  const { mutate: createSeason, isPending: creating } = useCreateSeason(league);
  const { mutate: updateSeason, isPending: updating } = useUpdateSeason(league);

  const isPending = creating || updating;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
    clearErrors,
  } = useForm({
    defaultValues: {
      name: season?.name || "",
      year: season?.year || "",
      dateRange: season
        ? {
            from: season.start_date ? new Date(season.start_date) : null,
            to: season.end_date ? new Date(season.end_date) : null,
          }
        : null,
      teams: season?.teams_list?.map((t) => t.id) || [],
    },
  });

  const selectedTeams = watch("teams") || [];

  const onToggleAllTeams = (checked) => {
    setValue("teams", checked ? teams.map((t) => t.id) : []);
  };

  const onToggleTeam = (checked, id) => {
    setValue(
      "teams",
      checked
        ? [...selectedTeams, id]
        : selectedTeams.filter((teamId) => teamId !== id)
    );
  };
  const onSubmit = (data) => {
    // Clear any existing errors before submission
    clearErrors();

    const jsonData = {
      ...data,
      start_date: data.dateRange?.from
        ? format(data.dateRange.from, "yyyy-MM-dd")
        : null,
      end_date: data.dateRange?.to
        ? format(data.dateRange.to, "yyyy-MM-dd")
        : null,
    };

    // Remove dateRange as it's not needed in the API
    delete jsonData.dateRange;

    const handleError = (err) => {
      console.error("Season operation error:", err);

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

    if (season) {
      updateSeason(
        { id: season.id, data: jsonData },
        {
          onSuccess: () => {
            onClose();
          },
          onError: handleError,
        }
      );
    } else {
      createSeason(jsonData, {
        onSuccess: () => {
          onClose();
        },
        onError: handleError,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-1">
      {/* Display general form errors */}
      {errors.root && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          <p className="text-sm font-medium">{errors.root.message}</p>
        </div>
      )}

      {/* Basic Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-4 w-4 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Basic Information
          </h3>
        </div>
        <ControlledInput
          name="name"
          control={control}
          label="Season Name"
          placeholder="Enter season name"
          rules={{
            required: "Season name is required",
            minLength: {
              value: 2,
              message: "Season name must be at least 2 characters",
            },
            maxLength: {
              value: 100,
              message: "Season name must not exceed 100 characters",
            },
          }}
          errors={errors}
        />
        <ControlledDateRangePicker
          name="dateRange"
          control={control}
          label="Date Range"
          placeholder="Select date range"
          rules={{
            required: "Date range is required",
            validate: (value) => {
              if (!value || !value.from) {
                return "Start date is required";
              }
              return true;
            },
          }}
          errors={errors}
          helpText="Select both dates, or only start date to auto-set end date after bracket generation."
          numberOfMonths={useIsMobile() ? 1 : 2}
        />
      </div>

      {/* Team Selection Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Users2 className="h-4 w-4 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Teams</h3>
        </div>
        <TeamSelection
          sportTeams={teams}
          selectedTeams={selectedTeams}
          handleToggleAllTeams={onToggleAllTeams}
          handleToggleTeam={onToggleTeam}
          error={errors.teams}
          disabled={season?.has_bracket}
          control={control}
        />
        {season?.has_bracket && (
          <p className="text-xs text-muted-foreground mt-1">
            Teams cannot be changed after a bracket has been generated.
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="mt-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            Please wait
          </>
        ) : season ? (
          "Update Season"
        ) : (
          "Create Season"
        )}
      </Button>
    </form>
  );
};

// Team selection UI
const TeamSelection = ({
  sportTeams,
  selectedTeams,
  handleToggleAllTeams,
  handleToggleTeam,
  error,
  disabled = false,
  control,
}) => (
  <div className="rounded-xl border bg-card/70 p-4 mt-2">
    <div className="flex items-center gap-2 mb-3 border-b pb-2">
      <Checkbox
        checked={
          sportTeams.length > 0 && selectedTeams.length === sportTeams.length
        }
        onCheckedChange={handleToggleAllTeams}
        disabled={disabled}
      />
      <Label className="text-sm font-semibold">Select All Teams</Label>
    </div>

    {/* Show validation message for teams */}
    {error && (
      <p className="text-xs text-destructive mb-3">
        {error.message}
      </p>
    )}

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {sportTeams.map((team) => {
        const isSelected = selectedTeams.includes(team.id);
        return (
          <div
            key={team.id}
            className={`flex items-center gap-3 p-2 rounded-lg transition-all border hover:border-primary/40 bg-background/60 ${
              isSelected ? "border-primary/60 bg-primary/5" : "border-border"
            } ${
              disabled
                ? "opacity-60 cursor-not-allowed pointer-events-none"
                : "cursor-pointer"
            }`}
            aria-disabled={disabled}
            onClick={(e) => {
              if (disabled) return;
              // Prevent double toggle if checkbox is clicked
              if (e.target.closest('button,input[type="checkbox"]')) return;
              handleToggleTeam(!isSelected, team.id);
            }}
          >
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => handleToggleTeam(checked, team.id)}
              disabled={disabled}
              tabIndex={disabled ? -1 : 0}
            />
            <Avatar className="w-8 h-8 border border-primary/20">
              <AvatarImage src={team.logo} alt={team.name} />
              <AvatarFallback className="bg-muted text-muted-foreground">
                {team.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium truncate max-w-[120px]">
              {team.name}
            </span>
          </div>
        );
      })}
    </div>

    {/* Hidden input for validation */}
    <Controller
      name="teams"
      control={control}
      rules={{
        validate: (value) => {
          if (value.length < 2) {
            return "At least 2 teams are required for a season";
          }
          return true;
        },
      }}
      render={() => null}
    />
  </div>
);

export default SeasonForm;
