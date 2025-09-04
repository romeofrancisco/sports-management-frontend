import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { TeamSelect } from "../common/TeamSelect";
import MultiSelect from "../common/ControlledMultiSelect";
import { useCreatePlayer, useUpdatePlayer } from "@/hooks/usePlayers";
import { Loader2 } from "lucide-react";
import { convertToFormData } from "@/utils/convertToFormData";
import { useSportPositions } from "@/hooks/useSports";
import ControlledInput from "../common/ControlledInput";
import ControlledSelect from "../common/ControlledSelect";
import { COURSE_CHOICES, SEX, YEAR_LEVEL_CHOICES } from "@/constants/player";
import { useSportTeams } from "@/hooks/useTeams";
import ControlledTeamSelect from "../common/ControlledTeamSelect";

const PlayerForm = ({ sports, onClose, player }) => {
  const isEdit = !!player;

  const { mutate: createPlayer, isPending: isCreating } = useCreatePlayer();
  const { mutate: updatePlayer, isPending: isUpdating } = useUpdatePlayer();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      first_name: player?.first_name || "",
      last_name: player?.last_name || "",
      email: player?.email || "",
      sex: player?.sex || "",
      year_level: player?.year_level || "",
      course: player?.course || "",
      profile: null,
      sport_slug: player?.sport.slug || "",
      height: player?.height || "",
      weight: player?.weight || "",
      jersey_number: player?.jersey_number || "",
      team_id: player?.team.id || "",
      position_ids: player?.positions.map((pos) => pos.id) || [],
    },
  });

  const selectedSport = watch("sport_slug");
  const selectedSex = watch("sex");

  // Convert sex to division for team filtering
  const division = selectedSex; // Since sex values match division values

  const { data: positions } = useSportPositions(selectedSport);
  const { data: teams } = useSportTeams(selectedSport, division);

  // Reset team selection when sex or sport changes
  useEffect(() => {
    if (!isEdit) {
      setValue("team_id", "");
    }
  }, [selectedSex, selectedSport, setValue, isEdit]);

  const onSubmit = (playerData) => {
    const formData = convertToFormData(playerData);

    const mutationFn = isEdit ? updatePlayer : createPlayer;
    const payload = isEdit ? { player: player.slug, data: formData } : formData;

    mutationFn(payload, {
      onSuccess: () => {
        onClose();
      },
      onError: (e) => {
        console.log("Error response:", e.response);
        const error = e.response?.data;
        if (error) {
          console.log("Error data:", error);
          Object.keys(error).forEach((fieldName) => {
            // Handle both string and array error formats
            let errorMessage = error[fieldName];
            if (Array.isArray(errorMessage)) {
              errorMessage = errorMessage[0]; // Take the first error message
            }
            console.log(`Setting error for ${fieldName}:`, errorMessage);
            setError(fieldName, {
              type: "server",
              message: errorMessage,
            });
          });
        }
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8 px-4 py-6 max-w-2xl mx-auto"
    >
      {/* Personal Details */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Personal Details
        </h2>
        <div className="space-y-4">
          {/* Only group truly related fields */}
          <div className="grid grid-cols-2 gap-3">
            <ControlledInput
              name="first_name"
              label="First Name"
              placeholder="Enter first name"
              control={control}
              errors={errors}
            />
            <ControlledInput
              name="last_name"
              label="Last Name"
              placeholder="Enter last name"
              control={control}
              errors={errors}
            />
          </div>
          
          <ControlledSelect
            name="sex"
            control={control}
            label="Sex"
            placeholder="Select sex"
            groupLabel="Sex"
            options={SEX}
            valueKey="value"
            labelKey="label"
            errors={errors}
          />
          
          <ControlledInput
            name="profile"
            label="Profile Photo"
            type="file"
            accept="image/*"
            control={control}
            errors={errors}
          />
        </div>
      </div>

      {/* Account Details */}
      <div className="space-y-4 pt-6 border-t border-border/60">
        <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Account Details
        </h2>
        <div className="space-y-4">
          <ControlledInput
            name="email"
            label="Email Address"
            placeholder="Enter email address"
            type="email"
            control={control}
            errors={errors}
          />
          
          <ControlledSelect
            name="year_level"
            control={control}
            label="Year Level"
            placeholder="Select year level"
            groupLabel="Year Level"
            options={YEAR_LEVEL_CHOICES}
            valueKey="value"
            labelKey="label"
            errors={errors}
          />
          
          <ControlledSelect
            name="course"
            control={control}
            label="Course"
            groupLabel="Course"
            placeholder="Select course"
            options={COURSE_CHOICES}
            valueKey="value"
            labelKey="label"
            errors={errors}
          />
          
          {!isEdit && (
            <ControlledInput
              name="password"
              label="Password"
              placeholder="Enter password"
              type="password"
              control={control}
              errors={errors}
            />
          )}
        </div>
      </div>

      {/* Player Information */}
      <div className="space-y-4 pt-6 border-t border-border/60">
        <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Player Information
        </h2>
        <div className="space-y-4">
          <ControlledSelect
            name="sport_slug"
            control={control}
            label="Sport"
            placeholder="Select sport"
            groupLabel="Sport"
            options={sports}
            valueKey="slug"
            labelKey="name"
            errors={errors}
          />
          
          <ControlledTeamSelect
            control={control}
            name="team_id"
            label="Team"
            placeholder={
              !selectedSport 
                ? "Please select sport first" 
                : !selectedSex 
                ? "Please select sex first" 
                : "Select team"
            }
            teams={teams}
            disabled={!selectedSport || !selectedSex}
            errorMessage={errors.team_id?.message}
            helperText={
              !selectedSport 
                ? "You must select a sport first to see available teams" 
                : !selectedSex 
                ? "You must select your sex to see available teams" 
                : ""
            }
          />
          
          <MultiSelect
            name="position_ids"
            label="Position"
            control={control}
            options={positions}
            max={3}
            placeholder="Select player position..."
            className=""
          />
          
          <ControlledInput
            name="jersey_number"
            label="Jersey Number"
            type="number"
            placeholder="Enter jersey number"
            control={control}
            errors={errors}
          />
          
          <ControlledInput
            name="height"
            label="Height (cm)"
            type="number"
            placeholder="Enter height in centimeters"
            control={control}
            errors={errors}
          />
          
          <ControlledInput
            name="weight"
            label="Weight (kg)"
            type="number"
            placeholder="Enter weight in kilograms"
            control={control}
            errors={errors}
          />
        </div>
      </div>

      <Button type="submit" disabled={isCreating || isUpdating}>
        {isCreating || isUpdating ? (
          <>
            <Loader2 className="animate-spin mr-2" />
            Please wait
          </>
        ) : isEdit ? (
          "Update Player"
        ) : (
          "Register Player"
        )}
      </Button>
    </form>
  );
};

export default PlayerForm;
