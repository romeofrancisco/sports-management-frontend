import React from "react";
import { useForm, Controller } from "react-hook-form";
import MultiSelect from "../common/ControlledMultiSelect";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { convertToFormData } from "@/utils/convertToFormData";
import { useCreateTeam, useUpdateTeam } from "@/hooks/useTeams";
import { DIVISIONS } from "@/constants/team";
import ControlledSelect from "../common/ControlledSelect";
import ControlledInput from "../common/ControlledInput";

const TeamForm = ({ coaches, sports, onClose, team = null }) => {
  const isEdit = !!team;

  const { mutate: createTeam, isPending: isCreating } = useCreateTeam();
  const { mutate: updateTeam, isPending: isUpdating } = useUpdateTeam();

  const { control, handleSubmit, formState: { errors }, setError } = useForm({
    defaultValues: {
      name: team?.name || "",
      sport: team?.sport || "",
      division: team?.division || "",
      coach: team?.coach.map((coach) => coach) || [],
      logo: null,
    },
  });

  const onSubmit = (teamData) => {
    const formData = convertToFormData(teamData);

    const mutationFn = isEdit ? updateTeam : createTeam;
    const payload = isEdit ? { team: team.slug, data: formData } : formData;

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
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 py-4">
      {/* Team Name */}
      <ControlledInput
        name="name"
        control={control}
        label="Team Name"
        placeholder="Enter Team Name"
        errors={errors}
      />

      {/* Sport */}
      <ControlledSelect
        name="sport"
        control={control}
        label="Sport"
        placeholder="Select Sport"
        options={sports}
        valueKey="id"
        labelKey="name"
        errors={errors}
      />

      {/* Division */}
      <ControlledSelect
        name="division"
        control={control}
        label="Division"
        placeholder="Select Team Division"
        options={DIVISIONS}
        errors={errors}
      />

      {/* Coach */}
      <MultiSelect
        name="coach"
        control={control}
        label="Coach"
        options={coaches}
        placeholder="Select Team Coaches"
        errors={errors}
        labelKey="full_name"
        max={3}
      />

      {/* Team Logo */}
      <ControlledInput
        name="logo"
        control={control}
        label="Team Logo"
        type="file"
        accept="image/*"
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
          "Update Team"
        ) : (
          "Register Team"
        )}
      </Button>
    </form>
  );
};

export default TeamForm;
