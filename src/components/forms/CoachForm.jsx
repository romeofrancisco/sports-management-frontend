import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { useCreateCoach, useUpdateCoach } from "@/hooks/useCoaches";
import { convertToFormData } from "@/utils/convertToFormData";
import { Loader2 } from "lucide-react";
import ControlledSelect from "../common/ControlledSelect";
import { SEX } from "@/constants/player";
import ControlledInput from "../common/ControlledInput";

const CoachForm = ({ onClose, coach = null }) => {
  const isEdit = !!coach;

  const { mutate: createCoach, isPending: isCreating } = useCreateCoach();
  const { mutate: updateCoach, isPending: isUpdating } = useUpdateCoach();

  const { control, handleSubmit, formState: { errors }, setError } = useForm({
    defaultValues: {
      first_name: coach?.first_name || "",
      last_name: coach?.last_name || "",
      sex: coach?.sex || "",
      email: coach?.email || "",
      password: "",
      profile: null,
    },
  });

  const onSubmit = (data) => {
    const formData = convertToFormData(data);

    const mutationFn = isEdit ? updateCoach : createCoach;
    const payload = isEdit ? { id: coach.id, data: formData } : formData;

    mutationFn(payload, {
      onSuccess: () => {
        onClose();
      },
      onError: (e) => {
        const error = e.response?.data;
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

      {/* Sex */}
      <ControlledSelect
        name="sex"
        control={control}
        label="Sex"
        placeholder="Select sex..."
        groupLabel="Sex"
        options={SEX}
        errors={errors}
      />

      {/* Email */}
      <ControlledInput
        name="email"
        label="Email"
        placeholder="Enter Email"
        type="email"
        control={control}
        errors={errors}
      />

      {/* Password */}
      {!isEdit && (
        <ControlledInput
          name="password"
          label="Password"
          placeholder="Enter Password"
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
          "Update Coach"
        ) : (
          "Register Coach"
        )}
      </Button>
    </form>
  );
};

export default CoachForm;
