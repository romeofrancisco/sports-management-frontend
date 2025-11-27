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
import { AddEditEventDialog } from "@/components/calendar/add-edit-event-dialog";
import { DateNavigator } from "@/components/calendar/date-navigator";
import FilterEvents from "@/components/calendar/filter";
import { TodayButton } from "@/components/calendar/today-button";
import { UserSelect } from "@/components/calendar/user-select";
import { Settings } from "@/components/calendar/settings";
import Views from "./view-tabs";
import { useRolePermissions } from "@/hooks/useRolePermissions";

export function CalendarHeader() {
  const { view, events } = useCalendar();
  const { isAdmin, isPlayer } = useRolePermissions();
  const { AddEditDialog } = useCalendar();
  const AddEditComponent = AddEditDialog || AddEditEventDialog;

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
            <div className="flex gap-2">
              {isAdmin() && <UserSelect />}
              <div className={`${!isAdmin() ? "hidden md:flex gap-2" : "flex gap-2 lg:gap-1.5"} `}>
                <FilterEvents />
                <Settings />
              </div>
            </div>
          </div>

          {!isPlayer() && (
            <AddEditComponent>
              <Button>
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
            </AddEditComponent>
          )}
        </div>
      </motion.div>
    </div>
  );
}
