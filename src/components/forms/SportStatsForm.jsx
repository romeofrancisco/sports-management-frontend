import React, { useEffect } from "react";
import ControlledInput from "../common/ControlledInput";
import { useForm } from "react-hook-form";
import ControlledCheckbox from "../common/ControlledCheckbox";
import ControlledSelect from "../common/ControlledSelect";
import { CALCULATION_TYPE, CALCULATION_TYPE_VALUES } from "@/constants/sport";
import ControlledMultiSelect from "../common/ControlledMultiSelect";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useCreateSportStats, useUpdateSportStats } from "@/hooks/useSports";

const SportStatsForm = ({ onClose, compositeStats, stat = null, sport }) => {
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
      code: stat?.code || "",
      is_record: stat?.is_record || false,

      // Recording Stats
      is_counter: stat?.is_counter || false,
      is_negative: stat?.is_negative || false,
      point_value: stat?.point_value || 0,
      display_name: stat?.display_name || "",

      // Metric Stats
      calculation_type: stat?.calculation_type || "none",
      composite_stats: stat?.composite_stats || [],
    },
  });

  const isRecord = watch("is_record");
  const calculationType = watch("calculation_type");
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
      setValue("calculation_type", "none");
      setValue("composite_stats", []);
    } else {
      // Reset recording stat fields when switching to metric stat
      setValue("display_name", "");
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
        name="code"
        label="Stat Code"
        help_text={
          <>
            <p>
              <strong>Important:</strong> This short code identifies
              the stat and is used in automated calculations. Use clear,
              consistent codes.
            </p>
            <p className="mt-2">Common suffixes:</p>
            <ul className="ml-4 list-disc">
              <li>
                <code>_AT</code>: Attempts
              </li>
              <li>
                <code>_MA</code>: Made
              </li>
              <li>
                <code>_MS</code>: Missed
              </li>
              <li>
                <code>_PC</code>: Percentage
              </li>
            </ul>
            <p className="mt-2 text-muted-foreground">
              Example: <code>FT_MA</code> for Free Throws Made.
            </p>
          </>
        }
        control={control}
        placeholder="Enter Stat Code"
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
          <ControlledInput
            name="display_name"
            label="Display Name"
            control={control}
            help_text='Label shown on action buttons (e.g. "Block", "Assist", "2PT Made", etc.). If left blank, the main stat name will be used.'
            placeholder="Enter Display Name"
            errors={errors}
          />
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
            name="calculation_type"
            control={control}
            label="Calculation Type"
            help_text={
              <>
                <p>How this stat is calculated:</p>
                <ul className="ml-4 list-disc">
                  <li>
                    <strong>Sum</strong>: Total of selected composite stats.
                  </li>
                  <li>
                    <strong>Percentage</strong>: First stat ÷ second stat × 100.
                  </li>
                </ul>
              </>
            }
            placeholder="Select Calculation Type"
            options={CALCULATION_TYPE}
            errors={errors}
          />

          <ControlledMultiSelect
            name="composite_stats"
            control={control}
            label="Stats Used for Calculation"
            placeholder="Select Stats"
            help_text="Select the stats that are used to calculate this stat. For percentages, use two stats (e.g., Made and Attempted). For totals, select all stats to be summed."
            options={compositeStats}
            errors={errors}
            max={
              calculationType === CALCULATION_TYPE_VALUES.PERCENTAGE
                ? 2
                : Infinity
            }
            secondaryKey="code"
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
