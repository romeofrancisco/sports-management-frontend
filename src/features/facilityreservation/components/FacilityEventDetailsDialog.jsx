"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { format, parseISO } from "date-fns";
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalDescription,
} from "@/components/calendar/responsive-modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useCalendar } from "@/components/calendar/calendar-context";
import { useUpdateReservation } from "@/hooks/useReservations";
import { toast } from "sonner";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { Badge } from "@/components/ui/badge";
import { useDisclosure } from "@/components/calendar/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";
import FacilityAddEditReservationDialog from "./FacilityAddEditReservationDialog";

export default function FacilityEventDetailsDialog({ event, children }) {
  const { onToggle, isOpen } = useDisclosure();
  const [editOpen, setEditOpen] = useState(false);
  const { updateEvent } = useCalendar();
  const { mutate: updateReservation, isPending: isUpdating } =
    useUpdateReservation();

  const raw = event?.raw || {};

  const currentUser = useSelector((state) => state.auth?.user);
  const isOwner =
    !!currentUser && String(currentUser.id) === String(event?.meta?.coach?.id);
  const { isAdmin } = useRolePermissions();
  const canManage = isOwner || isAdmin();

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

  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;

  let description = "";
  try {
    if (!endDate) {
      description = format(startDate, "PPpp");
    } else if (startDate.toDateString() === endDate.toDateString()) {
      // same day: show date once, then times
      description = `${format(startDate, "PP")}, ${format(
        startDate,
        "p"
      )} - ${format(endDate, "p")}`;
    } else {
      // different days: show full start and end datetimes
      description = `${format(startDate, "PPpp")} — ${format(endDate, "PPpp")}`;
    }
  } catch (e) {
    description = "";
  }

  return (
    <>
      <Modal open={isOpen} onOpenChange={onToggle} modal={false}>
        <ModalTrigger asChild>{children}</ModalTrigger>
        <ModalContent side="right">
          <ModalHeader>
            <ModalTitle className="mb-0 flex items-center gap-2">
              {event.meta.facility.name}

              {event.meta?.status == "approved" ? (
                <Badge className="bg-green-700 text-white">Approved</Badge>
              ) : event.meta?.status == "rejected" ? (
                <Badge className="bg-red-700 text-white">Rejected</Badge>
              ) : event.meta?.status == "cancelled" ? (
                <Badge variant="outline">Cancelled</Badge>
              ) : event.meta?.status == "expired" ? (
                <Badge className="bg-gray-700 text-white">Expired</Badge>
              ) : (
                <Badge className="bg-yellow-700 text-white">Pending</Badge>
              )}
            </ModalTitle>
            <ModalDescription>
              <div>
                <div className="text-sm flex items-center gap-0.5">
                  <Calendar className="size-4" />
                  {(() => {
                    try {
                      const s = new Date(event.startDate);
                      const e = event.endDate ? new Date(event.endDate) : null;

                      // If there's no end, show a single datetime for start
                      if (!e) {
                        return (
                          <div>
                            <div>{format(s, "PP")}</div>
                            <div>{format(s, "p")}</div>
                          </div>
                        );
                      }

                      // Same calendar date: show date once, then times
                      if (s.toDateString() === e.toDateString()) {
                        return (
                          <>
                            <div className="flex gap-1">
                              <p>{format(s, "PP")},</p>
                              <p className="text-muted-foreground">{`${format(
                                s,
                                "p"
                              )} - ${format(e, "p")}`}</p>
                            </div>
                          </>
                        );
                      }

                      // Different dates: show full start and end datetimes on separate lines
                      return (
                        <div className="flex flex-row items-center gap-1">
                          <div className="text-muted-foreground">
                            {format(s, "PPp")}
                          </div>
                          <span> - </span>
                          <div className="text-muted-foreground">
                            {format(e, "PPp")}
                          </div>
                        </div>
                      );
                    } catch (err) {
                      return "-";
                    }
                  })()}
                </div>
              </div>
            </ModalDescription>
          </ModalHeader>

          <img
            src={
              event.meta?.facility?.image ||
              "https://res.cloudinary.com/dzebi1atl/image/upload/v1763285456/assets/facility_placeholder_vkotox.svg"
            }
            alt={event.meta?.facility?.name || "Facility"}
            className="my-4 rounded object-cover w-full h-40 transition-all duration-200 dark:brightness-50"
          />

          <ScrollArea className="max-h-[70vh] md:px-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Reserved by:</p>
                <div className="flex items-center gap-1">
                  <Avatar className="size-10 border-2 border-primary/20">
                    <AvatarImage
                      src={event.meta?.coach?.image}
                      alt={event.meta?.coach?.name}
                    />
                    <AvatarFallback>
                      {(() => {
                        const p =
                          event.meta?.coach?.name?.trim().split(/\s+/) || [];
                        return (
                          (p[0]?.[0] + p[p.length - 1]?.[0])?.toUpperCase() ||
                          "C"
                        );
                      })()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">{event.meta?.coach?.name || "-"}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-[180px] md:max-w-full">
                      {event.meta?.coach?.email || "-"}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Purpose</p>
                <p className="text-sm bg-muted/20 min-h-20 rounded-lg text-muted-foreground p-2 border-2">
                  {event.description || event.meta?.facility?.description || ""}
                </p>
              </div>
            </div>
          </ScrollArea>
          {new Date(event.startDate) > new Date() &&
            event.meta?.status !== "cancelled" &&
            canManage && (
              <div className="w-full flex gap-2 mt-4 md:px-4 px-0">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    try {
                      const id = raw?.id || event?.id;
                      if (!id) return;
                      // set status to cancelled
                      updateReservation(
                        { id, data: { status: "cancelled" } },
                        {
                          onSuccess: (data) => {
                            try {
                              updateEvent(mapResponseToEvent(data));
                            } catch (e) {}
                            onToggle();
                            toast.info("Reservation cancelled");
                          },
                          onError: (err) => {
                            toast.error(
                              err?.response?.data?.detail ||
                                "Failed to cancel reservation"
                            );
                          },
                        }
                      );
                    } catch (err) {
                      console.error(err);
                      toast.error("Failed to cancel reservation");
                    }
                  }}
                  disabled={isUpdating}
                >
                  Cancel Reservation
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    // close details drawer then open edit dialog programmatically
                    onToggle();
                    setTimeout(() => setEditOpen(true), 50);
                  }}
                >
                  Update Reservation
                </Button>
              </div>
            )}

          <ModalClose />
        </ModalContent>
      </Modal>

      {/* Controlled Add/Edit dialog for updating this reservation */}
      <FacilityAddEditReservationDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        event={event}
      />
    </>
  );
}
