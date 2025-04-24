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
      password: player?.password || "",
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
      className="flex flex-col gap-2 px-1"
    >
      <h1 className="font-medium mb-2 text-lg">Personal Information</h1>
      {/* First Name */}
      <ControlledInput
        name="first_name"
        label="First Name"
        placeholder="Enter first name"
        control={control}
        errors={errors}
      />

      {/* Last Name */}
      <ControlledInput
        name="last_name"
        label="Last Name"
        placeholder="Enter last name"
        control={control}
        errors={errors}
      />

      {/* Email */}
      <ControlledInput
        name="email"
        label="Email"
        placeholder="Enter email"
        control={control}
        errors={errors}
      />

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

      {/* Year Level */}
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

      {/* Course */}
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

      {/* Password */}
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

      {/* Profile */}
      <ControlledInput
        name="profile"
        label="Profile"
        type="file"
        accept="image/*"
        control={control}
        errors={errors}
      />

      <h1 className="font-medium text-lg mt-5 py-2 border-t">
        Player Information
      </h1>

      {/* Sport */}
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

      {/* Team */}
      <TeamSelect
        control={control}
        name="team_id"
        label="Team"
        placeholder="Select team"
        teams={teams}
        errorMessage={errors.team_id?.message}
      />

      {/* Position */}
      <MultiSelect
        name="position_ids"
        label="Position"
        control={control}
        options={positions}
        max={3}
        placeholder="Select player position..."
      />

      {/* Jersey # */}
      <ControlledInput
        name="jersey_number"
        label="Jersey #"
        type="number"
        control={control}
        errors={errors}
      />

      {/* Height */}
      <ControlledInput
        name="height"
        label="Height"
        type="number"
        control={control}
        errors={errors}
      />

      {/* Weight */}
      <ControlledInput
        name="weight"
        label="Weight"
        type="number"
        control={control}
        errors={errors}
      />

      <Button
        type="submit"
        className="mt-4"
        disabled={isCreating || isUpdating}
      >
        {isCreating || isUpdating ? (
          <>
            <Loader2 className="animate-spin" />
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
