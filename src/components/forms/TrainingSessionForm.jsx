import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import {
  Loader2,
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  Info,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import ControlledInput from "../common/ControlledInput";
import ControlledTextarea from "../common/ControlledTextarea";
import ControlledDateTimePicker from "../common/ControlledDateTimePickerComponent";
import {
  useCreateTrainingSession,
  useUpdateTrainingSession,
} from "@/hooks/useTrainings";
import { format } from "date-fns";
import ControlledTeamSelect from "../common/ControlledTeamSelect";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import { useSports } from "@/hooks/useSports";

const TrainingSessionForm = ({ session = null, teams, onClose }) => {
  const isEdit = Boolean(session);
  const [selectedSport, setSelectedSport] = useState("all");
  const navigate = useNavigate();

  // Ensure teams is always an array to prevent "find is not a function" errors
  const safeTeams = Array.isArray(teams) ? teams : teams?.results || [];

  // Fetch sports for the filter dropdown
  const { data: sportsData = [] } = useSports();

  // Filter teams based on selected sport
  const filteredTeams =
    selectedSport === "all"
      ? safeTeams
      : safeTeams.filter((team) => team.sport?.toString() === selectedSport);

  const { mutate: createSession, isPending: isCreating } =
    useCreateTrainingSession();
  const { mutate: updateSession, isPending: isUpdating } =
    useUpdateTrainingSession();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
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
      notes: session?.notes || "",
    },
  });

  const onSubmit = (data) => {
    // Clear any existing errors before submission
    clearErrors();

    const payload = {
      ...data,
      // Ensure date is in proper format
      date: format(new Date(data.date), "yyyy-MM-dd"),
    };

    if (isEdit) {
      updateSession(
        { id: session.id, ...payload },
        {
          onSuccess: (data) => {
            onClose();
            // Navigate to session metrics page
            navigate(`/sessions/${data.id}/manage/session-metrics`);
          },
          onError: (error) => {
            console.error("Update error:", error);
            // Handle API validation errors
            const apiErrors = error.response?.data;
            if (apiErrors) {
              // Map API errors to form fields
              Object.keys(apiErrors).forEach((field) => {
                const message = Array.isArray(apiErrors[field])
                  ? apiErrors[field].join(", ")
                  : apiErrors[field];

                setError(field, {
                  type: "manual",
                  message: message,
                });
              });
            }
          },
        }
      );
    } else {
      createSession(payload, {
        onSuccess: (data) => {
          onClose();
          // Navigate to session metrics page
          navigate(`/sessions/${data.id}/manage/session-metrics`);
        },
        onError: (error) => {
          console.error("Create error:", error);
          // Handle API validation errors
          const apiErrors = error.response?.data;
          if (apiErrors) {
            // Map API errors to form fields
            Object.keys(apiErrors).forEach((field) => {
              const message = Array.isArray(apiErrors[field])
                ? apiErrors[field].join(", ")
                : apiErrors[field];

              setError(field, {
                type: "manual",
                message: message,
              });
            });
          }
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-1">
      {/* Basic Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-4 w-4 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Session Information
          </h3>
        </div>

        <ControlledInput
          control={control}
          name="title"
          label="Session Title"
          placeholder="Enter training session title"
          rules={{ required: "Title is required" }}
          errors={errors}
        />

        <ControlledTextarea
          control={control}
          name="description"
          label="Description"
          placeholder="Describe this training session"
          help_text="Optional: Provide details about the training focus or objectives"
          errors={errors}
        />
      </div>

      <Separator className="bg-border/50" />

      {/* Schedule Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Schedule</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ControlledDateTimePicker
            control={control}
            name="date"
            label="Date"
            type="date"
            help_text="Select the training date"
            placeholder="Select date"
            rules={{
              required: "Date is required",
              validate: (value) => {
                if (
                  value &&
                  new Date(value) < new Date().setHours(0, 0, 0, 0)
                ) {
                  return "Date cannot be in the past";
                }
                return true;
              },
            }}
            errors={errors}
          />

          <ControlledDateTimePicker
            control={control}
            name="start_time"
            label="Start Time"
            type="time"
            help_text="Training start time"
            placeholder="Select start time"
            rules={{ required: "Start time is required" }}
            errors={errors}
          />

          <ControlledDateTimePicker
            control={control}
            name="end_time"
            label="End Time"
            type="time"
            help_text="Training end time"
            placeholder="Select end time"
            rules={{
              required: "End time is required",
              validate: (value) => {
                const startTime = watch("start_time");
                if (value && startTime && value <= startTime) {
                  return "End time must be after start time";
                }
                return true;
              },
            }}
            errors={errors}
          />
        </div>

        <ControlledInput
          control={control}
          name="location"
          label="Location"
          placeholder="Enter training location"
          help_text="Venue or facility where the training will take place"
          rules={{ required: "Location is required" }}
          errors={errors}
        />
      </div>

      <Separator className="bg-border/50" />

      {/* Team Selection Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Team Assignment
          </h3>
        </div>

        {/* Sport Filter - Only show when teams are available and not editing */}
        {safeTeams.length > 0 && !isEdit && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              Filter by Sport
            </Label>
            <Select value={selectedSport} onValueChange={setSelectedSport}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select sport to filter teams" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                {sportsData?.map((sport) => (
                  <SelectItem key={sport.id} value={sport.id.toString()}>
                    {sport.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedSport !== "all" && (
              <p className="text-xs text-muted-foreground">
                Showing {filteredTeams.length} team
                {filteredTeams.length !== 1 ? "s" : ""} from selected sport
              </p>
            )}
          </div>
        )}

        <ControlledTeamSelect
          control={control}
          name="team"
          label="Team"
          placeholder="Select team"
          teams={filteredTeams}
          rules={{ required: "Team is required" }}
          errors={errors}
        />
      </div>

      <Separator className="bg-border/50" />

      {/* Additional Notes Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Additional Information
          </h3>
        </div>

        <ControlledTextarea
          control={control}
          name="notes"
          label="Notes"
          placeholder="Additional notes for this session"
          help_text="Optional: Any special instructions or requirements"
          errors={errors}
        />
      </div>

      {/* Form Actions */}
      <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border/50">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          className="w-full sm:w-auto order-2 sm:order-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEdit ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>{isEdit ? "Update Session" : "Create Session"}</>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default TrainingSessionForm;
