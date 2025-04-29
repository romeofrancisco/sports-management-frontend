import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import ControlledInput from "../common/ControlledInput";
import ControlledSelect from "../common/ControlledSelect";
import ControlledCheckbox from "../common/ControlledCheckbox";
import { Button } from "../ui/button";
import { useCreateSport, useUpdateSport } from "@/hooks/useSports";
import { SCORING_TYPE_CHOICES, SCORING_TYPE_VALUES } from "@/constants/sport";
import { sanitizeSportData } from "@/utils/sanitizeSportData";

const SportForm = ({ onClose, sport = null }) => {
  const isEdit = Boolean(sport);

  const { mutate: createSport, isPending: isCreating } = useCreateSport();
  const { mutate: updateSport, isPending: isUpdating } = useUpdateSport();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: sport?.name || "",
      scoring_type: sport?.scoring_type || "points",
      max_players_per_team: sport?.max_players_per_team || "",
      max_players_on_field: sport?.max_players_on_field || "",
      has_overtime: sport?.has_overtime || false,
      has_period: sport?.has_period || false,
      max_period: sport?.max_period || null,
      win_threshold: sport?.win_threshold || null,
      win_points_threshold: sport?.win_points_threshold || null,
      win_margin: sport?.win_margin || null,
      has_tie: sport?.has_tie || false,
    },
  });

  const scoringType = watch("scoring_type");
  const hasTie = watch("has_tie");
  const hasOvertime = watch("has_overtime");
  const hasPeriod = watch("has_period");

  // Handle field dependencies
  useEffect(() => {
    if (scoringType === SCORING_TYPE_VALUES.SETS) {
      setValue("has_period", true);
    }
  }, [scoringType, setValue]);

  useEffect(() => {
    if (hasTie && hasOvertime) {
      setValue("has_overtime", false);
    }
  }, [hasTie, hasOvertime, setValue]);

  useEffect(() => {
    if (hasOvertime && hasTie) {
      setValue("has_tie", false);
    }
  }, [hasOvertime, hasTie, setValue]);

  const onSubmit = (rawData) => {
    const data = sanitizeSportData(rawData);

    const mutationFn = isEdit ? updateSport : createSport;
    const payload = isEdit ? { id: sport.slug, data } : data;

    mutationFn(payload, {
      onSuccess: onClose,
      onError: (e) => {
        const error = e.response?.data;
        if (error) {
          Object.entries(error).forEach(([field, message]) => {
            setError(field, { type: "server", message });
          });
        }
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 px-1"
    >
      <ControlledInput
        name="name"
        label="Name"
        placeholder="Enter sport name"
        control={control}
        errors={errors}
      />

      <ControlledInput
        name="max_players_per_team"
        label="Max Team Players"
        placeholder="Default: 12"
        help_text="Maximum players allowed per team roster"
        type="number"
        control={control}
        errors={errors}
      />

      <ControlledInput
        name="max_players_on_field"
        label="Max Field Players"
        placeholder="Default: 5"
        help_text="Maximum players allowed on the field/court during play"
        type="number"
        control={control}
        errors={errors}
      />

      <ControlledSelect
        name="scoring_type"
        label="Scoring Format"
        placeholder="Select scoring format..."
        help_text="Select how the sport determines a winner (e.g., by points or by sets)."
        options={SCORING_TYPE_CHOICES}
        control={control}
        errors={errors}
      />

      {scoringType === SCORING_TYPE_VALUES.SETS && (
        <>
          <ControlledInput
            name="win_threshold"
            label="Sets Needed to Win the Match"
            placeholder="Leave empty if not required"
            help_text="Number of sets a team must win (e.g., 3 sets)."
            type="number"
            control={control}
            errors={errors}
          />
          <ControlledInput
            name="win_points_threshold"
            label="Points Needed to Win a Set"
            placeholder="Leave empty if not required"
            help_text="Number of points to win a set (e.g., 25 points)."
            type="number"
            control={control}
            errors={errors}
          />
          <ControlledInput
            name="win_margin"
            label="Win Margin"
            placeholder="Leave empty if no margin"
            help_text="Minimum point lead required to win (e.g., 2 points)."
            type="number"
            control={control}
            errors={errors}
          />
        </>
      )}

      <ControlledCheckbox
        name="has_period"
        label="Has Sets/Quarters"
        help_text="Enable if the sport has structured periods (e.g., sets, quarters)."
        control={control}
        errors={errors}
        disabled={scoringType === SCORING_TYPE_VALUES.SETS}
      />

      {hasPeriod && (
        <ControlledInput
          name="max_period"
          label="Maximum Sets/Quarters"
          placeholder="Max number of periods"
          help_text="Total number of sets, quarters, or periods (e.g., 4 quarters)."
          type="number"
          control={control}
          errors={errors}
        />
      )}

      <ControlledCheckbox
        name="has_tie"
        label="Allow Tie"
        help_text="Check if the match can result in a tie (draw)."
        control={control}
        errors={errors}
      />

      <ControlledCheckbox
        name="has_overtime"
        label="Allow Overtime"
        help_text="Enable if the match should continue into overtime when tied."
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
          "Update Sport"
        ) : (
          "Register Sport"
        )}
      </Button>
    </form>
  );
};

export default SportForm;
