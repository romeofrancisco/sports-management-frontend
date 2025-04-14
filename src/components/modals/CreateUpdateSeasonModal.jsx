import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateUpdateSeasonForm from "../forms/CreateUpdateSeasonForm";
import { useSportTeams } from "@/hooks/useTeams";
import Loading from "../common/Loading";

const CreateUpdateSeasonModal = ({ isOpen, onClose, league, sport, season = null }) => {
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
          <CreateUpdateSeasonForm
            league={league}
            teams={data}
            onClose={onClose}
            season={season}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUpdateSeasonModal;
