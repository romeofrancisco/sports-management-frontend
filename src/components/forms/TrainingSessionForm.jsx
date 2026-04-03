import React, { useState, useEffect } from "react";
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
  useTrainingReservedFacilities,
  useUpdateTrainingSession,
} from "@/hooks/useTrainings";
import { format } from "date-fns";
import ControlledTeamSelect from "../common/ControlledTeamSelect";
import { useSports } from "@/hooks/useSports";
import { Badge } from "../ui/badge";

const TrainingSessionForm = ({
  open = false,
  session = null,
  teams,
  onClose,
}) => {
  const isEdit = Boolean(session);
  const [selectedSport, setSelectedSport] = useState("all");
  const [locationMode, setLocationMode] = useState(
    session?.location ? "manual" : "reserved",
  );
  const [selectedReservationId, setSelectedReservationId] = useState("");
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
    reset,
    setValue,
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

  const {
    data: reservedFacilities = [],
    isFetching: isLoadingReservedFacilities,
  } = useTrainingReservedFacilities({}, open && locationMode === "reserved");

  const selectedReservation =
    reservedFacilities.find(
      (reservation) =>
        reservation.reservation_id.toString() === selectedReservationId,
    ) || null;

  // Ensure the form is reset whenever the dialog is closed (click outside / X)
  useEffect(() => {
    if (!open) {
      // Reset to cleared defaults and reset UI filters
      reset();
      setLocationMode(session?.location ? "manual" : "reserved");
      setSelectedReservationId("");
    }
    // only run when `open` changes
  }, [open, onClose, reset, session?.location]);

  useEffect(() => {
    if (locationMode === "manual") {
      setSelectedReservationId("");
      return;
    }

    if (!selectedReservationId) {
      setValue("location", "");
    }
  }, [locationMode, selectedReservationId, setValue]);

  const handleReservationSelect = (reservationId) => {
    setSelectedReservationId(reservationId);
    const reservation = reservedFacilities.find(
      (item) => item.reservation_id.toString() === reservationId,
    );

    if (!reservation) {
      return;
    }

    setValue("location", reservation.location, {
      shouldValidate: true,
      shouldDirty: true,
    });

    const reservationStart = new Date(reservation.start_datetime);
    const reservationEnd = new Date(reservation.end_datetime);

    setValue("date", format(reservationStart, "yyyy-MM-dd"), {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("start_time", format(reservationStart, "HH:mm"), {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("end_time", format(reservationEnd, "HH:mm"), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const applyReservationSchedule = () => {
    if (!selectedReservation) {
      return;
    }

    const reservationStart = new Date(selectedReservation.start_datetime);
    const reservationEnd = new Date(selectedReservation.end_datetime);

    setValue("date", format(reservationStart, "yyyy-MM-dd"), {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("start_time", format(reservationStart, "HH:mm"), {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("end_time", format(reservationEnd, "HH:mm"), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

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
        },
      );
    } else {
      createSession(payload, {
        onSuccess: (data) => {
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
          <h3 className="text-lg font-semibold text-primary">
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

      {/* Schedule and Venue Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-primary" />
          <h3 className="text-lg font-semibold text-primary">
            Schedule and Venue
          </h3>
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-sm font-medium text-foreground">
          Mode of Location Selection
        </Label>
        <Select value={locationMode} onValueChange={setLocationMode}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select location source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reserved">Reserved facility</SelectItem>
            <SelectItem value="manual">Manual location entry</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {locationMode === "reserved" ? (
        <div className="space-y-2">
          <div className="space-y-1">
            <Label className="text-sm font-medium text-foreground">
              Reserved Facilities
            </Label>
            <Select
              value={selectedReservationId}
              onValueChange={handleReservationSelect}
            >
              <SelectTrigger className="w-full" size="lg">
                <SelectValue placeholder="Select a reserved facility" />
              </SelectTrigger>
              <SelectContent>
                {reservedFacilities.map((reservation) => (
                  <SelectItem
                    key={reservation.reservation_id}
                    value={reservation.reservation_id.toString()}
                    className=""
                  >
                    <div className="grid">
                      <p className="text-sm text-start">
                        {reservation.facility_name}
                      </p>
                      <p className="text-start text-xs">
                        {format(
                          new Date(reservation.start_datetime),
                          "MMM d, yyyy - hh:mm:a",
                        )}{" "}
                        to{" "}
                        {format(
                          new Date(reservation.end_datetime),
                          "hh:mm:a",
                        )}{" "}
                      </p>
                    </div>
                    {reservation.status === "approved" && (
                      <Badge className=" bg-green-800 text-[0.6rem]">
                        Approved
                      </Badge>
                    )}
                    {reservation.status === "pending" && (
                      <Badge className=" bg-yellow-700 text-[0.6rem]">
                        Pending
                      </Badge>
                    )}
                  </SelectItem>
                ))}

                {isLoadingReservedFacilities && (
                  <p className="text-center py-4 text-xs text-muted-foreground">
                    Loading reserved facilities...
                  </p>
                )}
                {!isLoadingReservedFacilities &&
                  reservedFacilities.length === 0 && (
                    <p className="text-center py-4 text-xs text-muted-foreground">
                      No facilities reserved found.
                    </p>
                  )}
              </SelectContent>
            </Select>
          </div>

          <ControlledInput
            control={control}
            name="location"
            label="Selected Location"
            placeholder="Select a reservation to fill location"
            help_text="Location is auto-filled from the selected reservation"
            rules={{ required: "Location is required" }}
            errors={errors}
            disabled={true}
          />
        </div>
      ) : (
        <ControlledInput
          control={control}
          name="location"
          label="Location"
          placeholder="Enter training location"
          help_text="Manually type venue/facility and keep your own schedule"
          rules={{ required: "Location is required" }}
          errors={errors}
        />
      )}

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
              if (value && new Date(value) < new Date().setHours(0, 0, 0, 0)) {
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
          label="From"
          type="time"
          help_text="Training start time"
          placeholder="Select start time"
          rules={{ required: "Start time is required" }}
          errors={errors}
        />

        <ControlledDateTimePicker
          control={control}
          name="end_time"
          label="To"
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

      {/* Team Selection Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-primary" />
          <h3 className="text-lg font-semibold text-primary">
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

      {/* Additional Notes Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-primary" />
          <h3 className="text-lg font-semibold text-primary">
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
      <DialogFooter className="flex flex-col sm:flex-row gap-3 border-border/50">
        <Button
          type="button"
          variant="outline"
          onClick={() => onClose()}
          disabled={isCreating || isUpdating}
          className="w-full sm:w-auto order-2 sm:order-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isCreating || isUpdating}
          className="w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isCreating || isUpdating ? (
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
