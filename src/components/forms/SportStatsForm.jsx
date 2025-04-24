import React, { useEffect } from "react";
import ControlledInput from "../common/ControlledInput";
import { useForm } from "react-hook-form";
import ControlledCheckbox from "../common/ControlledCheckbox";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useCreateSportStats, useUpdateSportStats } from "@/hooks/useStats";
import ControlledSelect from "../common/ControlledSelect";

const SportStatsForm = ({ onClose, formulas, stat = null, sport }) => {
  const isEdit = !!stat;
  const { mutate: createStat, isPending: isCreating } = useCreateSportStats();
  const { mutate: updateStat, isPending: isUpdating } = useUpdateSportStats();

  const {
    control,
    formState: { errors },
    setError,
    setValue,
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      sport: sport,
      name: stat?.name || "",
      display_name: stat?.display_name || "",
      code: stat?.code || "",
      is_metrics: stat?.is_metrics || false,
      is_record: stat?.is_record || false,

      // Recording Stats
      is_counter: stat?.is_counter || false,
      is_negative: stat?.is_negative || false,
      point_value: stat?.point_value || 0,

      // Metric Stats
      formula: stat?.formula || "",
    },
  });

  const isRecord = watch("is_record");
  const isCounter = watch("is_counter");

  const onSubmit = (data) => {
    const mutationFn = isEdit ? updateStat : createStat;
    const payload = isEdit ? { id: stat.id, data: data } : data;

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

  useEffect(() => {
    if (isRecord) {
      // Reset metric stat fields when switching to recording stat
      setValue("formula", "");
    } else {
      // Reset recording stat fields when switching to metric stat
      setValue("is_counter", false);
      setValue("point_value", 0);
      setValue("is_negative", false);
    }
  }, [isRecord, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 px-1"
    >
      <ControlledInput
        name="name"
        label="Stat Name"
        control={control}
        placeholder="Enter Stat Name"
        errors={errors}
      />
      <ControlledInput
        name="display_name"
        label="Display Name"
        control={control}
        help_text="Label that will shown in summary stats (e.g, FGA (Field Goal Attempt), FG% (Field Goal Percentage))"
        placeholder="Enter Display Name"
        errors={errors}
      />
      <ControlledInput
        name="code"
        label="Stat Code"
        help_text="Code for formula"
        control={control}
        placeholder="Enter Stat Code"
        errors={errors}
      />
      <ControlledCheckbox
        name="is_metrics"
        label="Show in Metrics / Summary Stats"
        control={control}
        help_text="Check this if you want to show the stat in metrics or summary stats"
        errors={errors}
      />
      <ControlledCheckbox
        name="is_record"
        label="Recording Stat"
        control={control}
        help_text='Check if the stat is use for recording (e.g, "Assist", "Block", "Steal", etc.) else for metrics (e.g, "FG (Field Goal)", "FG% (Field Goal Percentage), etc.")'
        errors={errors}
      />

      {isRecord ? (
        <>
          <ControlledCheckbox
            name="is_negative"
            label="Negative Stat"
            control={control}
            help_text="Check this if the stat represents a negative action (e.g., Turnovers, Fouls)"
            errors={errors}
          />
          <ControlledCheckbox
            name="is_counter"
            label="Point Stat"
            control={control}
            help_text="Check if the stat has a point value (e.g, 3PT, 2PT , etc. (Basketball))"
            errors={errors}
          />
          {isCounter && (
            <ControlledInput
              name="point_value"
              label="Point Value"
              control={control}
              help_text="Number of points this stat contributes (e.g. 2 for a 2-point shot, 1 for a free throw). Used in score calculations."
              placeholder="Enter Point Value"
              type="number"
              errors={errors}
            />
          )}
        </>
      ) : (
        <>
          <ControlledSelect
            name="formula"
            control={control}
            label="Formula"
            help_text="Formula that will use in this stat"
            placeholder="Select Formula"
            options={formulas}
            valueKey="id"
            labelKey="name"
            secondaryLabel="expression"
            errors={errors}
            size="lg"
          />
        </>
      )}

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
          "Update Stat"
        ) : (
          "Create New Stat"
        )}
      </Button>
    </form>
  );
};

export default SportStatsForm;
