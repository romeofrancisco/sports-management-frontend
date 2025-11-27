"use client";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, Dumbbell, Medal, Text, Trophy, User, Volleyball } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCalendar } from "@/components/calendar/calendar-context";
import { AddEditEventDialog } from "@/components/calendar/add-edit-event-dialog";
import { formatTime } from "@/components/calendar/helpers";
import { useDeleteEvent } from "@/hooks/useEvents";
import { useRolePermissions } from "@/hooks/useRolePermissions";

export function EventDetailsDialog({ event, children }) {
  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);
  const { use24HourFormat, removeEvent } = useCalendar();
  const deleteEventMutation = useDeleteEvent();
  const { isPlayer } = useRolePermissions();
  const { AddEditDialog } = useCalendar();
  const AddEditComponent = AddEditDialog || AddEditEventDialog;

  const deleteEvent = (eventId) => {
    deleteEventMutation.mutate(eventId, {
      onSuccess: () => {
        removeEvent(eventId);
        toast.success("Event deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete event");
      },
    });
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case "training":
        return <Dumbbell className="size-5" />;
      case "practice":
        return <Volleyball className="size-5" />;
      case "league":
        return <Trophy className="size-5" />;
      case "tournament":
        return <Medal className="size-5" />;
      default:
        return <Calendar className="size-5" />;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px] gap-0">
      <DialogHeader className="grid grid-cols-[auto_1fr] gap-2">
          <div className="bg-primary p-2.5 rounded-md text-primary-foreground">
            {getEventTypeIcon(event.type)}
          </div>
          <div>
            <DialogTitle className="mb-0">
              {event.title}
            </DialogTitle>
            <DialogDescription>
              Detailed information about the event
            </DialogDescription>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh] my-5">
          <div className="space-y-4 px-4">
            <div className="flex items-start gap-2">
              <User className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Responsible</p>
                <p className="text-sm text-muted-foreground">
                  {event.user.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">From</p>
                <p className="text-sm text-muted-foreground">
                  {format(startDate, "EEEE dd MMMM")}
                  <span className="mx-1">at</span>
                  {formatTime(parseISO(event.startDate), use24HourFormat)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">To</p>
                <p className="text-sm text-muted-foreground">
                  {format(endDate, "EEEE dd MMMM")}
                  <span className="mx-1">at</span>
                  {formatTime(parseISO(event.endDate), use24HourFormat)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Text className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
        {event?.type === "event" && !isPlayer() && (
          <div className="flex justify-end gap-2">
            <AddEditComponent event={event}>
              <Button variant="outline">Edit</Button>
            </AddEditComponent>
            <Button
              variant="destructive"
              onClick={() => {
                deleteEvent(event.id);
              }}
            >
              Delete
            </Button>
          </div>
        )}
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
