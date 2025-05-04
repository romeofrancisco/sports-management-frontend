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

const SeasonModal = ({
  isOpen,
  onClose,
  league,
  sport,
  season = null,
}) => {
  const { data, isLoading } = useSportTeams(sport?.slug);

  if (isLoading) return <Loading />;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Create New Season</DialogTitle>
          <DialogDescription>
            <span className="sr-only">Season Description</span>
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[75vh]">
          <SeasonForm
            league={league}
            teams={data}
            onClose={onClose}
            season={season}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SeasonModal;
