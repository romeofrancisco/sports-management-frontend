import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateTournament, useUpdateTournament } from "@/hooks/useTournaments";
import { useSports } from "@/hooks/useSports";
import { useAllTeams } from "@/hooks/useTeams";
import Modal from "@/components/common/Modal";
import ControlledInput from "@/components/common/ControlledInput";
import ControlledSelect from "@/components/common/ControlledSelect";
import ControlledDatePicker from "@/components/common/ControlledDatePicker";
import { TeamSelection } from "@/components/forms/SeasonForm";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

const TournamentModal = ({ open, onOpenChange, tournament = null }) => {
  const isEditMode = !!tournament;
  const { data: sports } = useSports();
  const { mutate: createTournament, isPending: isCreating } = useCreateTournament();
  const { mutate: updateTournament, isPending: isUpdating } = useUpdateTournament();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setError,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      sport: "",
      division: "male",
      start_date: "",
      end_date: "",
    //   is_recorded: "true",
      logo: null,
      teams: [],
    },
  });

  const isPending = isCreating || isUpdating;
  const selectedSport = watch("sport");
  const selectedTeams = watch("teams") || [];

  // Fetch teams for the selected sport
  const { data: allTeams = [] } = useAllTeams(
    !!selectedSport,
    { sport: selectedSport }
  );

  // Division options
  const divisionOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

//   // Is Recorded options
//   const isRecordedOptions = [
//     { value: "true", label: "Yes" },
//     { value: "false", label: "No" },
//   ];

  // Reset form when dialog opens/closes or tournament changes
  useEffect(() => {
    if (open && tournament) {
      // Edit mode - populate form with tournament data
      reset({
        name: tournament.name || "",
        sport: tournament.sport?.id?.toString() || "",
        division: tournament.division || "male",
        // status: tournament.status || "upcoming",
        start_date: tournament.start_date || "",
        end_date: tournament.end_date || "",
        // is_recorded: tournament.is_recorded ? "true" : "false",
        logo: tournament.logo || null,
        teams: tournament.teams?.map((t) => t.id) || [],
      });
    } else if (open && !tournament) {
      // Create mode - reset to default values
      reset({
        name: "",
        sport: "",
        division: "male",
            // status: "upcoming",
        start_date: "",
        end_date: "",
        // is_recorded: "true",
        logo: null,
        teams: [],
      });
    }
  }, [open, tournament, reset]);

  const onToggleAllTeams = (checked) => {
    setValue("teams", checked ? allTeams.map((t) => t.id) : []);
  };

  const onToggleTeam = (checked, id) => {
    setValue(
      "teams",
      checked
        ? [...selectedTeams, id]
        : selectedTeams.filter((teamId) => teamId !== id)
    );
  };

  const onSubmit = async (data) => {
    // Check if we have a logo file to upload
    const hasLogoFile = data.logo && data.logo instanceof File;
    
    let submitData;
    
    if (hasLogoFile) {
      // Use FormData if we have a file
      const formData = new FormData();
      
      // Add all fields to FormData
      formData.append("name", data.name.trim());
      formData.append("sport", data.sport);
      formData.append("division", data.division);
      formData.append("start_date", data.start_date);
      formData.append("is_recorded", "false");
      
      if (data.end_date) {
        formData.append("end_date", data.end_date);
      }

      // Add teams as JSON array
      if (data.teams && data.teams.length > 0) {
        formData.append("teams", JSON.stringify(data.teams));
      }
      
      // Handle logo upload
      formData.append("logo", data.logo);

      submitData = formData;
    } else {
      // Use JSON if no file
      submitData = {
        name: data.name.trim(),
        sport: parseInt(data.sport),
        division: data.division,
        start_date: data.start_date,
        end_date: data.end_date || null,
        is_recorded: false,
        teams: data.teams || [],
      };
    }

    const handleError = (e) => {
      const error = e.response?.data;

      // If response is HTML (server error), show a generic message
      if (typeof error === "string" && error.includes("<!DOCTYPE")) {
        setError("name", {
          type: "server",
          message: "This tournament name already exists for this sport.",
        });
        return;
      }

      if (error) {
        // Check if error is a string (non-field error)
        if (typeof error === "string") {
          setError("name", {
            type: "server",
            message: error,
          });
          return;
        }

        // Check for non_field_errors
        if (error.non_field_errors) {
          const errorMessage = Array.isArray(error.non_field_errors)
            ? error.non_field_errors[0]
            : error.non_field_errors;
          setError("name", {
            type: "server",
            message: errorMessage,
          });
          return;
        }

        // Handle field-specific errors
        Object.keys(error).forEach((fieldName) => {
          // Skip if the key looks like it's part of a split string (numeric keys)
          if (!isNaN(fieldName)) {
            return;
          }

          // Handle both string and array error formats
          let errorMessage = error[fieldName];
          if (Array.isArray(errorMessage)) {
            errorMessage = errorMessage[0]; // Take the first error message
          }

          setError(fieldName, {
            type: "server",
            message: errorMessage,
          });
        });
      } else {
        // Fallback error message
        setError("name", {
          type: "server",
          message: isEditMode 
            ? "Failed to update tournament. Please try again." 
            : "Failed to create tournament. Please try again.",
        });
      }
    };

    if (isEditMode) {
      // Update existing tournament
      updateTournament(
        { tournamentId: tournament.id, tournamentData: submitData },
        {
          onSuccess: () => {
            reset();
            onOpenChange(false);
          },
          onError: handleError,
        }
      );
    } else {
      // Create new tournament
      createTournament(submitData, {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
        onError: handleError,
      });
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? "Edit Tournament" : "Create Tournament"}
      description={
        isEditMode
          ? "Update tournament information"
          : "Create a new tournament"
      }
      icon={Trophy}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-1">
        {/* Tournament Name */}
        <ControlledInput
          name="name"
          control={control}
          label="Tournament Name"
          placeholder="Enter tournament name"
          errors={errors}
          rules={{
            required: "Tournament name is required",
            minLength: {
              value: 2,
              message: "Tournament name must be at least 2 characters",
            },
            maxLength: {
              value: 255,
              message: "Tournament name must not exceed 255 characters",
            },
          }}
          disabled={isPending}
        />

        {/* Sport Select */}
        <ControlledSelect
          name="sport"
          control={control}
          label="Sport"
          placeholder="Select sport"
          options={sports}
          errors={errors}
          rules={{ required: "Sport is required" }}
          valueKey="id"
          labelKey="name"
          disabled={isPending}
        />

        {/* Division Select */}
        <ControlledSelect
          name="division"
          control={control}
          label="Division"
          placeholder="Select division"
          options={divisionOptions}
          errors={errors}
          rules={{ required: "Division is required" }}
          disabled={isPending}
        />

        {/* Date Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ControlledDatePicker
            name="start_date"
            control={control}
            label="Start Date"
            placeholder="Select start date"
            errors={errors}
            rules={{ required: "Start date is required" }}
            disabled={isPending}
          />

          <ControlledDatePicker
            name="end_date"
            control={control}
            label="End Date"
            placeholder="Select end date (optional)"
            errors={errors}
            disabled={isPending}
          />
        </div>

        {/* Is Recorded Select */}
        {/* <ControlledSelect
          name="is_recorded"
          control={control}
          label="Record Statistics"
          placeholder="Record game statistics?"
          options={isRecordedOptions}
          errors={errors}
          rules={{ required: "This field is required" }}
          disabled={isPending}
        /> */}

        {/* Logo Upload */}
        <ControlledInput
          name="logo"
          control={control}
          type="file"
          label="Tournament Logo"
          errors={errors}
          disabled={isPending}
          currentImageUrl={isEditMode ? tournament?.logo : null}
        />

        {/* Team Selection */}
        {selectedSport && allTeams.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Teams (Optional)</h3>
            <TeamSelection
              sportTeams={allTeams}
              selectedTeams={selectedTeams}
              handleToggleAllTeams={onToggleAllTeams}
              handleToggleTeam={onToggleTeam}
              error={errors.teams}
              disabled={isPending}
              control={control}
            />
            <p className="text-xs text-muted-foreground">
              You can add teams now or later from the tournament details page.
            </p>
          </div>
        )}

        {selectedSport && allTeams.length === 0 && (
          <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 p-4">
            <p className="text-sm text-muted-foreground text-center">
              No teams available for the selected sport. Create teams first or add them later.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Trophy className="animate-pulse" />
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Trophy />
                {isEditMode ? "Update Tournament" : "Create Tournament"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TournamentModal;
