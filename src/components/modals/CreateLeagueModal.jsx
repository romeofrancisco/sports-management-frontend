import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTeams } from "@/hooks/useTeams";
import { useSports } from "@/hooks/useSports";
import Loading from "../common/Loading";
import CreateLeagueForm from "../forms/CreateLeagueForm";
import PageError from "@/pages/PageError";
import { ScrollArea } from "../ui/scroll-area";

const CreateLeagueModal = ({ isOpen, onClose }) => {
  const { data: sports, isLoading: isSportsLoading, isError: isSportsError } = useSports(isOpen)
  const { data: teams, isLoading: isTeamsLoading, isError: isTeamsError } = useTeams(isOpen);

  if (isTeamsLoading || isSportsLoading) return <Loading />;
  if (isSportsError || isTeamsError) return <PageError />

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create League</DialogTitle>
          <DialogDescription>Create League.</DialogDescription>
          <ScrollArea className="max-h-[75vh]">
            <CreateLeagueForm teams={teams} sports={sports} onClose={onClose} />
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeagueModal;
