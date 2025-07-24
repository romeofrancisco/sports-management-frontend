import React from "react";
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

  const { data: positions } = useSportPositions(selectedSport);
  const { data: teams } = useSportTeams(selectedSport);

  const onSubmit = (playerData) => {
    const formData = convertToFormData(playerData);

    const mutationFn = isEdit ? updatePlayer : createPlayer;
    const payload = isEdit ? { player: player.slug, data: formData } : formData;

    mutationFn(payload, {
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 px-1"
    >
      {/* Personal Details */}
      <div>
        <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2">
          Personal Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <ControlledInput
            name="email"
            label="Email"
            placeholder="Enter email"
            control={control}
            errors={errors}
          />
          <ControlledInput
            name="profile"
            label="Profile"
            type="file"
            accept="image/*"
            control={control}
            errors={errors}
          />
        </div>
      </div>

      {/* Account Details */}
      <div className="pt-4 border-t border-border">
        <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          Account Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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
          <ControlledSelect
            name="year_level"
            control={control}
            label="Year Level"
            placeholder="Select Year Level"
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
            placeholder="Select Course"
            options={COURSE_CHOICES}
            valueKey="value"
            labelKey="label"
            errors={errors}
          />
        </div>
        {!isEdit && (
          <ControlledInput
            name="password"
            label="Password"
            placeholder="Enter password"
            type="password"
            control={control}
            errors={errors}
            className="mt-2"
          />
        )}
      </div>

      {/* Player Information */}
      <div className="pt-4 border-t border-border">
        <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          Player Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <ControlledSelect
            name="sport_slug"
            control={control}
            label="Sport"
            placeholder="Select Sport"
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
            placeholder="Select team"
            teams={teams}
            errorMessage={errors.team_id?.message}
          />
        </div>
        <MultiSelect
          name="position_ids"
          label="Position"
          control={control}
          options={positions}
          max={3}
          placeholder="Select player position..."
          className="mt-2"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
          <ControlledInput
            name="jersey_number"
            label="Jersey #"
            type="number"
            control={control}
            errors={errors}
          />
          <ControlledInput
            name="height"
            label="Height"
            type="number"
            control={control}
            errors={errors}
          />
          <ControlledInput
            name="weight"
            label="Weight"
            type="number"
            control={control}
            errors={errors}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isCreating || isUpdating}
      >
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
