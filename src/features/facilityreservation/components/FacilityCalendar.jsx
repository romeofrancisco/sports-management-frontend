import React from "react";
import { CalendarBody } from "@/components/calendar/calendar-body";
import { CalendarProvider } from "@/components/calendar/calendar-context";
import { DndProvider } from "@/components/calendar/dnd-context";
import FacilityCalendarHeader from "./FacilityCalendarHeader";
import FacilityAddEditReservationDialog from "./FacilityAddEditReservationDialog";
import FacilityEventDetailsDialog from "./FacilityEventDetailsDialog";
import { useReservations } from "@/hooks/useReservations";
import { useCoaches } from "@/hooks/useCoaches";
import { useCalendar } from "@/components/calendar/calendar-context";

function FacilityCalendarContent() {
  const { view, selectedDate, setEvents } = useCalendar();

  const { data: events } = useReservations({ view: view, date: selectedDate });

  const eventsRef = React.useRef(null);

  React.useEffect(() => {
    const eventsStr = JSON.stringify(events);
    if (events && eventsStr !== eventsRef.current) {
      eventsRef.current = eventsStr;
      setEvents(events);
    }
  }, [events, setEvents]);


  return (
    <DndProvider showConfirmation={true}>
      <div className="w-full border-2 border-primary/20 rounded-xl">
        <FacilityCalendarHeader />
        <CalendarBody />
      </div>
    </DndProvider>
  );
}

export function FacilityCalendar() {
  return (
    <CalendarProvider
      events={[]}
      users={[]}
      view="month"
      addEditDialogComponent={FacilityAddEditReservationDialog}
      detailsDialogComponent={FacilityEventDetailsDialog}
    >
      <FacilityCalendarContent />
    </CalendarProvider>
  );
}

export default FacilityCalendar;
