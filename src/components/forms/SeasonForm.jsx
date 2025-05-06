import React from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

import ControlledInput from "@/components/common/ControlledInput";
import ControlledCheckbox from "@/components/common/ControlledCheckbox";
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
      is_recorded: season?.is_recorded ?? true,
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
    // Create a JSON object instead of FormData
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

    if (season) {
      updateSeason({ id: season.id, data: jsonData }, {
        onSuccess: () => {
          onClose();
        },
        onError: (err) => {
          const errorData = err.response?.data;
          if (errorData) {
            Object.entries(errorData).forEach(([field, message]) => {
              setError(field, { type: "server", message });
            });
          }
        }
      });
    } else {
      createSeason(jsonData, {
        onSuccess: () => {
          onClose();
        },
        onError: (err) => {
          const errorData = err.response?.data;
          if (errorData) {
            Object.entries(errorData).forEach(([field, message]) => {
              setError(field, { type: "server", message });
            });
          }
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Season Name */}
      <ControlledInput
        name="name"
        control={control}
        label="Season Name"
        placeholder="Enter season name"
        errors={errors}
      />

      {/* Year */}
      <ControlledInput
        name="year"
        control={control}
        label="Year"
        placeholder="Enter year"
        errors={errors}
      />

      {/* Date Range */}
      <ControlledDateRangePicker
        name="dateRange"
        control={control}
        label="Date Range"
        placeholder="Select date range"
        errors={errors}
        helpText="Select start and end dates for the season"
        numberOfMonths={useIsMobile() ? 1 : 2}
      />

      {/* Is Stats Recorded */}
      <ControlledCheckbox
        name="is_recorded"
        control={control}
        label="Record stats for this season"
        errors={errors}
        className="mt-2"
      />

      {/* Team Selection */}
      <div className="mt-2">
        <Label className="text-sm text-left">Teams</Label>
        <TeamSelection
          sportTeams={teams}
          selectedTeams={selectedTeams}
          handleToggleAllTeams={onToggleAllTeams}
          handleToggleTeam={onToggleTeam}
          error={errors.teams}
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" className="mt-4" disabled={isPending}>
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
}) => (
  <div className="border-y py-2 mt-2">
    <div className="flex items-center gap-2 mb-2 border-b py-1">
      <Checkbox
        checked={
          sportTeams.length > 0 && selectedTeams.length === sportTeams.length
        }
        onCheckedChange={handleToggleAllTeams}
      />
      <Label className="text-sm">Select All Teams</Label>
      {error && <p className="text-xs text-destructive">{error.message}</p>}
    </div>
    <div className="grid grid-cols-2 gap-3">
      {sportTeams.map((team) => (
        <div key={team.id} className="flex items-center gap-2">
          <Checkbox
            checked={selectedTeams.includes(team.id)}
            onCheckedChange={(checked) => handleToggleTeam(checked, team.id)}
          />
          <Avatar>
            <AvatarImage src={team.logo} alt={team.name} />
          </Avatar>
          <span className="text-sm">{team.name}</span>
        </div>
      ))}
    </div>
  </div>
);

export default SeasonForm;
