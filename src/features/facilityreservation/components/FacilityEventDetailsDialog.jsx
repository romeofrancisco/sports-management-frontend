"use client";
import React from "react";
import { format, parseISO } from "date-fns";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useCalendar } from "@/components/calendar/calendar-context";
import { useUpdateReservation } from "@/hooks/useReservations";
import { toast } from "sonner";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { Badge } from "@/components/ui/badge";

function formatSafe(dateStr) {
  try {
    return dateStr ? format(parseISO(dateStr), "EEEE dd MMMM yyyy, p") : "-";
  } catch (e) {
    return "-";
  }
}

export default function FacilityEventDetailsDialog({ event, children }) {
  const { updateEvent } = useCalendar();
  const updateMutation = useUpdateReservation();
  const { isAdmin } = useRolePermissions();

  const raw = event?.raw || {};

  const mapResponseToEvent = (r) => ({
    id: r.id,
    title: r.facility?.name
      ? `${r.facility.name} - ${r.coach?.first_name || ""}`
      : `Reservation ${r.id}`,
    description: r.notes || "",
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
    raw: r,
  });

  const onAction = (action) => {
    if (!raw.id) return toast.error("Invalid reservation");
    updateMutation.mutate(
      { id: raw.id, data: { status: action } },
      {
        onSuccess: (data) => {
          try {
            updateEvent(mapResponseToEvent(data));
          } catch (e) {}
          toast.success(`Reservation ${action}`);
        },
        onError: () => toast.error("Failed to update reservation"),
      }
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.meta?.facility?.name || event.title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] px-4">
          <div className="space-y-4 py-2">
            <div>
              <p className="text-sm font-medium">Reserved by:</p>
              <p className="text-sm text-muted-foreground">
                {event.meta?.coach?.name || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium">From:</p>
              <p className="text-sm text-muted-foreground">
                {formatSafe(event.startDate)}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium">To:</p>
              <p className="text-sm text-muted-foreground">
                {formatSafe(event.endDate)}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium">Notes</p>
              <p className="text-sm text-muted-foreground">
                {event.description || event.meta?.facility?.description || ""}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium">Status</p>
              {event.meta?.status == "approved" ? (
                <Badge className="bg-green-700 text-white">Approved</Badge>
              ) : event.meta?.status == "rejected" ? (
                <Badge className="bg-red-700 text-white">Rejected</Badge>
              ) : (
                <Badge className="bg-yellow-700 text-white">Pending</Badge>
              )}
            </div>
          </div>
        </ScrollArea>

        {isAdmin() && (event?.meta?.status ?? "").toLowerCase() === "pending" && (
          <div className="flex gap-2 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => onAction("rejected")}
              disabled={updateMutation.isLoading}
            >
              Reject
            </Button>
            <Button onClick={() => onAction("approved")} disabled={updateMutation.isLoading}>
              Approve
            </Button>
          </div>
        )}

        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
