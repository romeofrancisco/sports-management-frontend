import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Loader2, X, Plus } from "lucide-react";
import ControlledInput from "../common/ControlledInput";
import ControlledTextarea from "../common/ControlledTextarea";
import ControlledSelect from "../common/ControlledSelect";
import ControlledMultiSelect from "../common/ControlledMultiSelect";
import ControlledCombobox from "../common/ControlledCombobox";
import {
  useCreateTrainingSession,
  useUpdateTrainingSession,
} from "@/hooks/useTrainings";
import { Badge } from "../ui/badge";
import { format } from "date-fns";

const TrainingSessionForm = ({
  session = null,
  categories,
  teams,
  onClose,
}) => {
  const isEdit = Boolean(session);
  // Ensure teams is always an array to prevent "find is not a function" errors
  const safeTeams = Array.isArray(teams) ? teams : teams?.results || [];
  // Ensure categories is always an array to prevent "find is not a function" errors
  const safeCategories = Array.isArray(categories) ? categories : categories?.results || [];
  const { mutate: createSession, isPending: isCreating } =
    useCreateTrainingSession();
  const { mutate: updateSession, isPending: isUpdating } =
    useUpdateTrainingSession();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: session?.title || "",
      description: session?.description || "",
      date: session?.date
        ? format(new Date(session.date), "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd"),
      start_time: session?.start_time || "17:00",
      end_time: session?.end_time || "19:00",
      location: session?.location || "",
      team: session?.team || "",
      categories: session?.categories?.map((cat) => cat.id) || [],
      notes: session?.notes || "",
    },
  });
  const selectedTeamId = watch("team");
  // Find the selected team's slug
  const selectedTeamObj = React.useMemo(
    () =>
      safeTeams?.find(
        (t) =>
          t.id === selectedTeamId ||
          t.id?.toString() === selectedTeamId?.toString()
      ),
    [safeTeams, selectedTeamId]
  );

  const selectedCategories = watch("categories") || [];

  const isPending = isCreating || isUpdating;

  const onSubmit = (data) => {
    const payload = {
      ...data,
      // Ensure date is in proper format
      date: format(new Date(data.date), "yyyy-MM-dd"),
    };

    if (isEdit) {
      updateSession(
        { id: session.id, ...payload },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createSession(payload, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-1">
      <ControlledInput
        control={control}
        name="title"
        label="Session Title"
        placeholder="Enter training session title"
        rules={{ required: "Title is required" }}
      />

      <ControlledTextarea
        control={control}
        name="description"
        label="Description"
        placeholder="Describe this training session"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ControlledInput
          control={control}
          name="date"
          label="Date"
          type="date"
          rules={{ required: "Date is required" }}
        />

        <div className="grid grid-cols-2 gap-2">
          <ControlledInput
            control={control}
            name="start_time"
            label="Start Time"
            type="time"
            rules={{ required: "Start time is required" }}
          />
          <ControlledInput
            control={control}
            name="end_time"
            label="End Time"
            type="time"
            rules={{ required: "End time is required" }}
          />
        </div>
      </div>

      <ControlledInput
        control={control}
        name="location"
        label="Location"
        placeholder="Enter training location"        rules={{ required: "Location is required" }}
      />

      <ControlledCombobox
        control={control}
        name="team"
        label="Team"
        placeholder="Select team"
        options={safeTeams}
        valueKey="id"
        labelKey="name"
        rules={{ required: "Team is required" }}
      />

      <ControlledMultiSelect
        control={control}
        name="categories"
        label="Training Categories"
        placeholder="Select training categories"
        options={safeCategories}
        rules={{ required: "At least one category is required" }}
      />

      {selectedCategories.length > 0 && (
        <div>
          <div className="text-sm font-medium mb-2">Selected Categories:</div>
          <div className="flex flex-wrap gap-2">          {selectedCategories.map((catId) => {
              const category = safeCategories.find((c) => c.id === catId);
              if (!category) return null;
              return (
                <Badge key={catId} style={{ backgroundColor: "#007bff" }}>
                  {category.name}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      <ControlledTextarea
        control={control}
        name="notes"
        label="Notes"
        placeholder="Additional notes for this session"
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Update" : "Schedule"} Training Session
        </Button>
      </div>
    </form>
  );
};

export default TrainingSessionForm;
