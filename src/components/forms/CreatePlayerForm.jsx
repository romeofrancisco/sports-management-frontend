import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import { TeamSelect } from "../common/TeamSelect";
import MultiSelect from "../common/MultiSelect";
import { useCreatePlayer } from "@/hooks/usePlayers";
import { Loader2 } from "lucide-react";
import useFilteredTeams from "@/hooks/useFilteredTeams";
import { convertToFormData } from "@/utils/convertToFormData";
import { useSportPositions } from "@/hooks/useSports";
import ControlledInput from "../common/ControlledInput";
import ControlledSelect from "../common/ControlledSelect";
import { COURSE_CHOICES, SEX, YEAR_LEVEL_CHOICES } from "@/constants/player";

const CreatePlayerForm = ({ teams, sports, onClose }) => {
  const { mutate: createPlayer, isPending } = useCreatePlayer();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      sex: "",
      year_level: "",
      course: "",
      password: "",
      profile: null,
      sport_id: "",
      height: "",
      weight: "",
      jersey_number: "",
      team_id: "",
      position_ids: [],
    },
  });

  const selectedSport = watch("sport_id");

  const { data: positions } = useSportPositions(selectedSport);

  const filteredTeams = useFilteredTeams(teams, sports, selectedSport);

  const onSubmit = (playerData) => {
    const formData = convertToFormData(playerData);

    createPlayer(formData, {
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
        label="Max Team Players"
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
        placeholder="Select Course"
        groupLabel="Course"
        options={COURSE_CHOICES}
        valueKey="value"
        labelKey="label"
        errors={errors}
      />

      {/* Password */}
      <ControlledInput
        name="password"
        label="Password"
        placeholder="Enter password"
        type="password"
        control={control}
        errors={errors}
      />

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
        name="sport_id"
        control={control}
        label="Sport"
        placeholder="Select Sport"
        groupLabel="Sport"
        options={sports}
        valueKey="id"
        labelKey="name"
        errors={errors}
      />

      {/* Team */}
      <TeamSelect
        control={control}
        name="team_id"
        label="Team"
        placeholder="Select team"
        teams={filteredTeams}
        errorMessage={errors.team_id?.message}
      />

      {/* Position */}
      <div className="grid gap-0.5">
        <Label className="text-sm text-left">Position</Label>
        <Controller
          name="position_ids"
          control={control}
          render={({ field }) => (
            <MultiSelect
              options={positions?.map((position) => ({
                value: position.id,
                label: position.name,
              }))}
              max={3}
              value={field.value}
              onChange={field.onChange}
              placeholder="Select player position..."
            />
          )}
        />
        {errors.position_ids && (
          <p className="text-xs text-left text-destructive">
            {errors.position_ids.message}
          </p>
        )}
      </div>

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

      <Button type="submit" className="mt-4" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="animate-spin" />
            Please wait
          </>
        ) : (
          "Register Player"
        )}
      </Button>
    </form>
  );
};

export default CreatePlayerForm;
