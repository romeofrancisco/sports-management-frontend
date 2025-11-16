"use client";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  slideFromLeft,
  slideFromRight,
  transition,
} from "@/components/calendar/animations";
import { useCalendar } from "@/components/calendar/calendar-context";
import { FacilityAddEditReservationDialog } from "./FacilityAddEditReservationDialog";
import { DateNavigator } from "@/components/calendar/date-navigator";
import FilterEvents from "@/components/calendar/filter";
import { TodayButton } from "@/components/calendar/today-button";
import { Settings } from "@/components/calendar/settings";
import { FacilityFilterEvents } from "./FacilityFilterEvents";
import { FacilitySettings } from "./FacilitySettings";
import Views from "@/components/calendar/view-tabs";
import { useRolePermissions } from "@/hooks/useRolePermissions";

export function FacilityCalendarHeader() {
  const { view, events } = useCalendar();
  const { isAdmin, isPlayer } = useRolePermissions();

  return (
    <div className="flex flex-col gap-2 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
      <motion.div
        className="flex items-center  gap-2"
        variants={slideFromLeft}
        initial="initial"
        animate="animate"
        transition={transition}
      >
        <TodayButton />
        <DateNavigator view={view} events={events} />
        {!isAdmin() && (
          <div className={`flex flex-col ml-auto gap-2 md:hidden`}>
            <Settings />
            <FilterEvents />
          </div>
        )}
      </motion.div>
      <motion.div
        className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-1.5"
        variants={slideFromRight}
        initial="initial"
        animate="animate"
        transition={transition}
      >
        <div className="flex flex-col gap-2 xl:flex-row xl:items-center lg:gap-1.5">
          <div className="flex flex-col md:flex-row gap-2 ">
            <Views />
            <div className="flex flex-row-reverse gap-2">
              <div
                className={`${
                  !isAdmin() ? "hidden" : "flex gap-2 lg:gap-1.5"
                } `}
              >
                {/* facility-specific controls */}
                <FacilityFilterEvents />
                {isAdmin() && <FacilitySettings />}
              </div>
              {!isPlayer() && (
                <FacilityAddEditReservationDialog>
                  <Button className="flex-1">
                    <Plus className="h-4 w-4" />
                    Add Reservation
                  </Button>
                </FacilityAddEditReservationDialog>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default FacilityCalendarHeader;
