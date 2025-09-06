import React from "react";
import { useForm } from "react-hook-form";
import { useCreateLeague, useUpdateLeague } from "@/hooks/useLeagues";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { convertToFormData } from "@/utils/convertToFormData";
import ControlledSelect from "../common/ControlledSelect";
import ControlledInput from "../common/ControlledInput";
import { DIVISIONS } from "@/constants/team";

const LeagueForm = ({ sports, onClose, league = null }) => {
  const isEdit = !!league;
  const { mutate: createLeague, isPending: isCreating } = useCreateLeague();
  const { mutate: updateLeague, isPending: isUpdating } = useUpdateLeague();
  const isPending = isCreating || isUpdating;

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: league?.name || "",
      division: league?.division || "",
      sport: isEdit ? String(league.sport.id) : "",
      logo: null,
    },
  });

  const onSubmit = (data) => {
    const formData = convertToFormData(data);

    const mutationFn = isEdit ? updateLeague : createLeague;
  const payload = isEdit ? { id: league.id, data: formData } : formData;

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
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 py-3 px-1">
      {/* League Name */}
      <ControlledInput
        name={"name"}
        control={control}
        label="League Name"
        placeholder="Enter league name"
        rules={{ required: "League name is required" }}
        errors={errors}
      />

      {/* Sport Select */}
      <ControlledSelect
        name={"sport"}
        control={control}
        label="Sport"
        placeholder="Select a sport"
        options={sports}
        valueKey="id"
        labelKey="name"
        rules={{ required: "Sport is required" }}
        errors={errors}
        className="w-full"
      />

      <ControlledSelect
        name={"division"}
        control={control}
        label="Division"
        placeholder="Select a division"
        options={DIVISIONS}
        valueKey="value"
        labelKey="label"
        rules={{ required: "Division is required" }}
        errors={errors}
        className="w-full"
      />

      {/* League Logo */}
      <ControlledInput
        name={"logo"}
        control={control}
        label="League Logo"
        type="file"
        accept="image/*"
        errors={errors}
      />

      <Button type="submit" className="mt-4" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="animate-spin mr-2" />
            Please wait
          </>
        ) : isEdit ? (
          "Update League"
        ) : (
          "Create League"
        )}
      </Button>
    </form>
  );
};

export default LeagueForm;
