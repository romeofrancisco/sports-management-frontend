import React from "react";
import { useForm } from "react-hook-form";
import ControlledInput from "../common/ControlledInput";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useCreateSport, useUpdateSport } from "@/hooks/useSports";
import ControlledCheckbox from "../common/ControlledCheckbox";
import ControlledSelect from "../common/ControlledSelect";
import { SCORING_TYPE_CHOICES, SCORING_TYPE_VALUES } from "@/constants/sport";

const SportForm = ({ onClose, sport = null }) => {
  const isEdit = !!sport;

  const { mutate: createSport, isPending: isCreating } = useCreateSport();
  const { mutate: updateSport, isPending: isUpdating } = useUpdateSport();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
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

  const onSubmit = (data) => {
    const mutationFn = isEdit ? updateSport : createSport;
    const payload = isEdit ? { id: sport.id, data: data } : data;

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
      className="flex flex-col gap-4 px-1"
    >
      {/* Sports Name */}
      <ControlledInput
        name="name"
        label="Name"
        placeholder="Enter sport name"
        control={control}
        errors={errors}
      />

      {/* Max Team Players */}
      <ControlledInput
        name="max_players_per_team"
        help_text="Maximum players allowed per team roster"
        label="Max Team Players"
        placeholder="Max team players ( default: 12 )"
        type="number"
        control={control}
        errors={errors}
      />

      {/* Max Field Players */}
      <ControlledInput
        name="max_players_on_field"
        help_text="Maximum players allowed on the field/court during play"
        label="Max Field Players"
        placeholder="Max field players ( default: 5 )"
        type="number"
        control={control}
        errors={errors}
      />

      {/* Scoring Type */}
      <ControlledSelect
        name="scoring_type"
        control={control}
        label="Scoring Format"
        placeholder="Select Scoring Format..."
        options={SCORING_TYPE_CHOICES}
        help_text="Select how the sport determines a winner (e.g., by points or by sets)."
      />

      {scoringType === SCORING_TYPE_VALUES.SETS && (
        <>
          {/* Win Threshold */}
          <ControlledInput
            name="win_threshold"
            help_text="Enter the number of sets a team must win to secure the match (e.g., 3 sets). Leave empty if no specific threshold."
            label="Sets Needed to Win the Match"
            placeholder="Leave empty if no threshold is required"
            type="number"
            control={control}
            errors={errors}
          />
          {/* Win Points Threshold */}
          <ControlledInput
            name="win_points_threshold"
            help_text="Enter the number of points a team must reach to win a set (e.g., 25 points). Leave empty if no specific threshold."
            label="Points Needed to Win a Set"
            placeholder="Leave empty if no threshold is required"
            type="number"
            control={control}
            errors={errors}
          />
          {/* Win Margin */}
          <ControlledInput
            name="win_margin"
            help_text="Minimum lead required to win (e.g., 2 points)."
            label="Win Margin"
            placeholder="Leave empty if no win margin is required"
            type="number"
            control={control}
            errors={errors}
          />
        </>
      )}

      {/* Has Period */}
      <ControlledCheckbox
        name="has_period"
        label="Has Sets/Quarters"
        help_text="Check this if the sport uses structured periods (e.g., sets in volleyball or quarters in basketball)."
        control={control}
        errors={errors}
      />

      {/* Has Tie */}
      <ControlledCheckbox
        name="has_tie"
        label="Allow Overtime"
        help_text="Check this if the match can result in a tie (Draw)."
        control={control}
        errors={errors}
      />
      {/* Has Overtime */}
      <ControlledCheckbox
        name="has_overtime"
        label="Has Draws"
        help_text="Enable if matches can continue into overtime when tied at the end of regulation."
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
