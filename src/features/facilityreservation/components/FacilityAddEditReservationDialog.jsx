import { zodResolver } from "@hookform/resolvers/zod";
import { addMinutes, format, set } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/calendar/responsive-modal";
import { COLORS } from "@/components/calendar/constants";
import { useCalendar } from "@/components/calendar/calendar-context";
import { useDisclosure } from "@/components/calendar/hooks";
import { reservationSchema } from "@/components/calendar/schemas";
import {
  useCreateReservation,
  useUpdateReservation,
} from "@/hooks/useReservations";
import { useFacilities } from "@/hooks/useFacilities";
import { useCoaches } from "@/hooks/useCoaches";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import ControlledInput from "@/components/common/ControlledInput";
import ControlledSelect from "@/components/common/ControlledSelect";
import SelectCoach from "@/components/common/SelectCoach";
import ControlledTextarea from "@/components/common/ControlledTextarea";
import { ControlledDateTimePicker } from "@/components/common/ControlledDateTimePicker";

export function FacilityAddEditReservationDialog({
  children,
  startDate,
  startTime,
  event,
}) {
  const { isOpen, onClose, onToggle } = useDisclosure();
  const { addEvent, updateEvent } = useCalendar();
  const createReservationMutation = useCreateReservation();
  const updateReservationMutation = useUpdateReservation();
  const isEditing = !!event;
  const { isAdmin, isCoach } = useRolePermissions();

  const { data: facilitiesData } = useFacilities(
    {},
    { staleTime: 1000 * 60 * 5, noPagination: true }
  );
  const facilities = facilitiesData || [];

  const { data: coachesData } = useCoaches({}, 1, 1000);
  const coaches = coachesData?.results || [];

  const initialDates = useMemo(() => {
    if (!isEditing && !event) {
      if (!startDate) {
        const now = new Date();
        return { startDate: now, endDate: addMinutes(now, 30) };
      }
      const start = startTime
        ? set(new Date(startDate), {
            hours: startTime.hour,
            minutes: startTime.minute,
            seconds: 0,
          })
        : new Date(startDate);
      const end = addMinutes(start, 30);
      return { startDate: start, endDate: end };
    }

    return {
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
    };
  }, [startDate, startTime, event, isEditing]);

  const form = useForm({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      title: event?.title ?? "",
      description: event?.notes ?? event?.description ?? "",
      color: event?.color ?? COLORS[0] ?? "green",
      startDate: initialDates.startDate,
      endDate: initialDates.endDate,
      facility_id: event?.meta?.facility?.id ?? (facilities[0]?.id || null),
      coach_id: event?.meta?.coach?.id ?? null,
    },
  });

  useEffect(() => {
    form.reset({
      title: event?.title ?? "",
      description: event?.notes ?? event?.description ?? "",
      facility_id: event?.meta?.facility?.id ?? (facilities[0]?.id || null),
      color: event?.color ?? COLORS[0] ?? "green",
      startDate: initialDates.startDate,
      endDate: initialDates.endDate,
    });
  }, [event, initialDates, form]);

  // When facilities load, ensure the form has a facility_id selected
  useEffect(() => {
    const current = form.getValues("facility_id");
    if ((!current || current === null) && facilities.length > 0) {
      form.setValue("facility_id", facilities[0].id);
    }
  }, [facilities, form]);

  // form-level server error (non-field)
  const [formError, setFormError] = useState(null);

  const onSubmit = (values) => {
    try {
      console.debug(
        "FacilityAddEditReservationDialog onSubmit values:",
        values
      );
      // Ensure only coaches or admins can create reservations client-side
      if (!isAdmin() && !isCoach()) {
        toast.error("Only coaches or admins can create reservations.");
        return;
      }

      // Build payload matching backend fields
      const payload = {
        facility_id: values.facility_id,
        coach_id: values.coach_id || undefined,
        // send ISO strings with timezone to backend
        start_datetime: new Date(values.startDate).toISOString(),
        end_datetime: new Date(values.endDate).toISOString(),
        notes: values.description,
      };

      const mapResponseToEvent = (r) => ({
        id: r.id,
        title: r.facility?.name
          ? `${r.facility.name} - ${r.coach?.first_name || ""}`
          : `Reservation ${r.id}`,
        notes: r.notes || "",
        description: r.notes || r.description || "",
        startDate: new Date(r.start_datetime).toISOString(),
        endDate: new Date(r.end_datetime).toISOString(),
        color:
          r.status === "approved"
            ? "green"
            : r.status === "rejected"
            ? "red"
            : "orange",
        meta: {
          status: r.status,
          facility: r.facility,
          coach: r.coach,
          requested_by: r.requested_by,
        },
      });

      // clear previous server errors
      setFormError(null);
      form.clearErrors();

      const handleServerErrors = (error) => {
        const data = error?.response?.data;
        if (!data) return;

        const makeMessage = (m) => (Array.isArray(m) ? m.join(" ") : String(m));

        const mapKeyToField = (key) => {
          const k = String(key);
          if (["start_datetime", "startDate"].includes(k)) return "startDate";
          if (["end_datetime", "endDate"].includes(k)) return "endDate";
          if (["facility", "facility_id"].includes(k)) return "facility_id";
          if (["notes", "description"].includes(k)) return "description";
          if (["coach", "coach_id"].includes(k)) return "coach_id";
          return k;
        };

        const keys = Object.keys(data || {});
        let hadField = false;
        keys.forEach((k) => {
          const val = data[k];
          if (k === "non_field_errors" || k === "__all__") {
            setFormError(makeMessage(val));
            return;
          }
          const field = mapKeyToField(k);
          try {
            form.setError(field, { type: "server", message: makeMessage(val) });
            hadField = true;
          } catch (e) {}
        });

        if (!hadField && keys.length > 0) {
          setFormError(JSON.stringify(data));
        }
      };

      if (isEditing) {
        updateReservationMutation.mutate(
          { id: event.id, data: payload },
          {
            onSuccess: (data) => {
              try {
                updateEvent(mapResponseToEvent(data));
              } catch (e) {}
              toast.success("Reservation updated successfully");
              onClose();
              form.reset();
            },
            onError: (error) => {
              if (error?.response?.status === 400) {
                handleServerErrors(error);
                return;
              }
              const msg =
                error?.response?.data?.detail ||
                JSON.stringify(error?.response?.data) ||
                error.message ||
                "Failed to update reservation";
              toast.error(msg);
            },
          }
        );
      } else {
        console.debug(
          "FacilityAddEditReservationDialog submitting payload:",
          payload
        );
        createReservationMutation.mutate(payload, {
          onSuccess: (data) => {
            try {
              addEvent(mapResponseToEvent(data));
            } catch (e) {}
            toast.success("Reservation created successfully");
            onClose();
            form.reset();
          },
          onError: (error) => {
            if (error?.response?.status === 400) {
              handleServerErrors(error);
              return;
            }
            const msg =
              error?.response?.data?.detail ||
              JSON.stringify(error?.response?.data) ||
              error.message ||
              "Failed to create reservation";
            toast.error(msg);
          },
        });
      }
    } catch (error) {
      console.error(
        `Error ${isEditing ? "editing" : "adding"} reservation:`,
        error
      );
      toast.error(`Failed to ${isEditing ? "edit" : "add"} reservation`);
    }
  };

  const onSubmitError = (errors) => {
    console.warn("Reservation form validation errors:", errors);
    toast.error("Please fix the highlighted fields before submitting");
  };

  return (
    <Modal open={isOpen} onOpenChange={onToggle} modal={false}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {isEditing ? "Edit Reservation" : "Add New Reservation"}
          </ModalTitle>
          <ModalDescription>
            {isEditing
              ? "Modify this reservation."
              : "Create a new facility reservation."}
          </ModalDescription>
        </ModalHeader>

        <Form {...form}>
          {formError && (
            <div className="text-sm text-red-600 mb-2">{formError}</div>
          )}
          <form
            id="reservation-form"
            onSubmit={form.handleSubmit(onSubmit, onSubmitError)}
            className="grid gap-4 py-4"
          >
            <ControlledInput
              name="title"
              control={form.control}
              label="Title"
              placeholder="Enter a title"
              errors={form.formState.errors}
            />

            <ControlledSelect
              name="facility_id"
              control={form.control}
              label="Facility"
              options={facilities}
              valueKey="id"
              labelKey="name"
              errors={form.formState.errors}
            />

            {isAdmin() && (
              <SelectCoach
                name="coach_id"
                control={form.control}
                label="Coach"
                coaches={coaches}
                placeholder="Select Coach To Reserve For"
                errors={form.formState.errors}
              />
            )}

            <div className="flex flex-col md:flex-row gap-4">
              <ControlledDateTimePicker
                name="startDate"
                control={form.control}
                label="Start Date"
                errors={form.formState.errors}
                className="flex-1"
              />

              <ControlledDateTimePicker
                name="endDate"
                control={form.control}
                label="End Date"
                errors={form.formState.errors}
                className="flex-1"
              />
            </div>

            <ControlledTextarea
              name="description"
              control={form.control}
              label="Purpose"
              placeholder="Enter purpose"
              errors={form.formState.errors}
            />
          </form>
        </Form>

        <ModalFooter className="flex justify-end gap-2">
          <ModalClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </ModalClose>
          <Button form="reservation-form" type="submit">
            {isEditing ? "Save Changes" : "Create Reservation"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default FacilityAddEditReservationDialog;
