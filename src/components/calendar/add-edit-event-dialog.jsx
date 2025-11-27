import { zodResolver } from "@hookform/resolvers/zod";
import { addMinutes, format, set } from "date-fns";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/calendar/date-time-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import { COLORS } from "@/components/calendar/constants";
import { useCalendar } from "@/components/calendar/calendar-context";
import { useDisclosure } from "@/components/calendar/hooks";
import { eventSchema } from "@/components/calendar/schemas";
import { useCreateEvent, useUpdateEvent } from "@/hooks/useEvents";
import { CalendarPlus } from "lucide-react";

export function AddEditEventDialog({ children, startDate, startTime, event }) {
  const { isOpen, onClose, onToggle } = useDisclosure();
  const { addEvent, updateEvent } = useCalendar();
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const isEditing = !!event;

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

  const isPending =
    createEventMutation.isPending || updateEventMutation.isPending;

  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title ?? "",
      description: event?.description ?? "",
      // Provide a default color so schema validation passes even when the
      // color input is not shown in the form UI.
      color: event?.color ?? COLORS[0] ?? "blue",
      startDate: initialDates.startDate,
      endDate: initialDates.endDate,
    },
  });

  useEffect(() => {
    form.reset({
      title: event?.title ?? "",
      description: event?.description ?? "",
      color: event?.color ?? COLORS[0] ?? "blue",
      startDate: initialDates.startDate,
      endDate: initialDates.endDate,
    });
  }, [event, initialDates, form]);

  const onSubmit = (values) => {
    try {
      const formattedEvent = {
        ...values,
        // ensure color is present for backend/schema
        color: values.color ?? COLORS[0] ?? "blue",
        startDate: format(values.startDate, "yyyy-MM-dd'T'HH:mm:ss"),
        endDate: format(values.endDate, "yyyy-MM-dd'T'HH:mm:ss"),
      };

      if (isEditing) {
        // call backend update
        updateEventMutation.mutate(
          { id: event.id, data: formattedEvent },
          {
            onSuccess: (data) => {
              // update local calendar state
              try {
                updateEvent(data || formattedEvent);
              } catch (e) {}
              toast.success("Event updated successfully");
              onClose();
              form.reset();
            },
            onError: (err) => {
              console.error("Update event failed", err);
              toast.error("Failed to update event");
            },
          }
        );
      } else {
        // call backend create
        createEventMutation.mutate(formattedEvent, {
          onSuccess: (data) => {
            try {
              addEvent(data || formattedEvent);
            } catch (e) {}
            toast.success("Event created successfully");
            onClose();
            form.reset();
          },
          onError: (err) => {
            console.error("Create event failed", err);
            toast.error("Failed to create event");
          },
        });
      }
    } catch (error) {
      console.error(`Error ${isEditing ? "editing" : "adding"} event:`, error);
      toast.error(`Failed to ${isEditing ? "edit" : "add"} event`);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={onToggle} modal={false}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalContent className="sm:max-w-[400px]">
        <ModalHeader className="grid grid-cols-[auto_1fr] gap-2">
          <div className="bg-primary p-2.5 rounded-md">
            <CalendarPlus className="text-primary-foreground" />
          </div>
          <div>
            <ModalTitle className="mb-0">
              {isEditing ? "Edit Event" : "Add New Event"}
            </ModalTitle>
            <ModalDescription>
              {isEditing
                ? "Modify your existing event."
                : "Create a new event for your calendar."}
            </ModalDescription>
          </div>
        </ModalHeader>

        <Form {...form}>
          <form
            id="event-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="title" className="required">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      placeholder="Enter a title"
                      {...field}
                      className={fieldState.invalid ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <DateTimePicker form={form} field={field} />
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <DateTimePicker form={form} field={field} />
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="required">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter a description"
                      className={fieldState.invalid ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <ModalFooter className="flex justify-end gap-2">
          <ModalClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </ModalClose>
          <Button form="event-form" type="submit" disabled={isPending}>
            {isPending
              ? isEditing
                ? "Saving..."
                : "Creating..."
              : isEditing
              ? "Save Changes"
              : "Create Event"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
