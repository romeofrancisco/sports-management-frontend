import React from "react";
import { useForm } from "react-hook-form";
import ControlledInput from "../common/ControlledInput";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useCreateSport, useUpdateSport } from "@/hooks/useSports";
import ControlledCheckbox from "../common/ControlledCheckbox";

const SportForm = ({ onClose, sport = null }) => {
  const isEdit = !!sport;

  const { data: createSport, isPending: isCreating } = useCreateSport();
  const { date: updateSport, isPending: isUpdating } = useUpdateSport();

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: sport?.name || "",
      scoring_type: sport?.scoring_type || "",
      max_players_per_team: sport?.max_players_per_team || "",
      max_players_on_field: sport?.max_players_on_field || "",
      has_period: sport?.has_period || false,
      max_period: sport?.max_period || "",
      win_threshold: sport?.win_threshold || "",
      has_tie: sport?.has_tie || false,
    },
  });

  const onSubmit = (data) => {
    console.log(data);
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
        placeholder="Enter sports name"
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

      {/* Win Threshold */}
      <ControlledInput
        name="win_threshold"
        help_text="Target value needed to win a match (e.g., 3 sets, 25 points)"
        label="Win Threshold"
        placeholder="Leave empty if no threshold is required"
        type="number"
        control={control}
        errors={errors}
      />

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
        label="Has Draws"
        help_text="Check this if the match can result in a tie (Draw)."
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
