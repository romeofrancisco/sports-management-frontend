import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SeasonForm from "../forms/SeasonForm";
import { useSportTeams } from "@/hooks/useTeams";
import Loading from "../common/FullLoading";
import { ScrollArea } from "../ui/scroll-area";

const SeasonModal = ({ isOpen, onClose, sport, season = null }) => {
  const { data, isLoading } = useSportTeams(sport?.slug);

  if (isLoading) return <Loading />;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {season ? "Edit Season" : "Create New Season"}
          </DialogTitle>
          <DialogDescription>
            {season
              ? "Update the season details below."
              : "Fill in the details to create a new season."}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[75vh] pr-3">
          <SeasonForm teams={data} onClose={onClose} season={season} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SeasonModal;
