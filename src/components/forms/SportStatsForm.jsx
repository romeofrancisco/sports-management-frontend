import React, { useEffect } from "react";
import ControlledInput from "../common/ControlledInput";
import { useForm } from "react-hook-form";
import ControlledCheckbox from "../common/ControlledCheckbox";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useCreateSportStats, useUpdateSportStats } from "@/hooks/useStats";
import ControlledSelect from "../common/ControlledSelect";
import { is } from "date-fns/locale";

const SportStatsForm = ({
  onClose,
  formulas,
  stat = null,
  sport,
  categories,
}) => {
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
      category: stat?.category || "",

      is_player_summary: stat?.is_player_summary || false,
      is_team_summary: stat?.is_team_summary || false,
      is_team_comparison: stat?.is_team_comparison || false,

      // is_player_stat: stat?.is_player_stat || false,
      // is_team_stat: stat?.is_team_stat || false,

      is_boxscore: stat?.is_boxscore || false,
      is_record: stat?.is_record || false,

      // Recording Stats
      is_points: stat?.is_points || false,
      is_negative: stat?.is_negative || false,
      point_value: stat?.point_value || 0,

      // Metric Stats
      formula: stat?.formula || "",
    },
  });

  const isRecord = watch("is_record");
  const isPoints = watch("is_points");

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
      setValue("is_points", false);
      setValue("point_value", 0);
      setValue("is_negative", false);
    }
  }, [isRecord, setValue]);

  // Reset point_value when is_points is unchecked
  useEffect(() => {
    if (!isPoints) {
      setValue("point_value", 0);
    }
  }, [isPoints, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 px-1"
    >
      {/* Name */}
      <ControlledInput
        name="name"
        label="Stat Name"
        control={control}
        placeholder="Enter Stat Name"
        errors={errors}
      />

      {/* Display Name */}
      <ControlledInput
        name="display_name"
        label="Display Name"
        control={control}
        help_text="Label that will shown in summary stats (e.g, FGA (Field Goal Attempt), FG% (Field Goal Percentage))"
        placeholder="Enter Display Name"
        errors={errors}
      />

      {/* Code */}
      <ControlledInput
        name="code"
        label="Stat Code"
        help_text="Code for formula"
        control={control}
        placeholder="Enter Stat Code"
        errors={errors}
      />

      {/* Category */}
      <ControlledSelect
        name="category"
        control={control}
        label="Category"
        help_text="Select the category for organizing this stat in the UI"
        placeholder="Select Category"
        options={[...(categories || []), { id: null, name: "Other" }]}
        valueKey="id"
        labelKey="name"
        errors={errors}
      />

      {/* Player Summary */}
      <ControlledCheckbox
        name="is_player_summary"
        label="Player Summary"
        control={control}
        help_text="Check this if the stat is shown in player summary"
        errors={errors}
      />

      {/* Team Summary */}
      <ControlledCheckbox
        name="is_team_summary"
        label="Team Summary"
        control={control}
        help_text="Check this if the stat is shown in team summary"
        errors={errors}
      />

      <ControlledCheckbox
        name="is_team_comparison"
        label="Team Comparison"
        control={control}
        help_text="Check this if the stat is shown in team comparison"
        errors={errors}
      />

      {/* Player Stat */}
      {/* <ControlledCheckbox
        name="is_player_stat"
        label="Player Stat"
        control={control}
        help_text="Check this if the stat is for players"
        errors={errors}
      />

      {/* Team Stat */}
      {/* <ControlledCheckbox
        name="is_team_stat"
        label="Team Stat"
        control={control}
        help_text="Check this if the stat is for teams"
        errors={errors}
      /> */}

      {/* Boxscore */}
      <ControlledCheckbox
        name="is_boxscore"
        label="Boxscore"
        control={control}
        help_text="Check this if the stat is shown in boxscore"
        errors={errors}
      />

      {/* Recording Stat */}
      <ControlledCheckbox
        name="is_record"
        label="Recording Stat"
        control={control}
        help_text='Check if the stat is use for recording (e.g, "Assist", "Block", "Steal", etc.) else for calculations (e.g, "FG (Field Goal)", "FG% (Field Goal Percentage), etc.")'
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
            name="is_points"
            label="Point Stat"
            control={control}
            help_text="Check if the stat has a point value (e.g, 3PT, 2PT , etc. (Basketball))"
            errors={errors}
          />
          {isPoints && (
            <>
              <ControlledInput
                name="point_value"
                label="Point Value"
                control={control}
                help_text="Number of points this stat contributes (e.g. 2 for a 2-point shot, 1 for a free throw). Used in score calculations. If the Negative checkbox is checked, this value will be points for opposing team"
                placeholder="Enter Point Value"
                type="number"
                errors={errors}
              />
            </>
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
