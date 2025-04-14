import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSports } from "@/hooks/useSports";
import Loading from "../common/Loading";
import PageError from "@/pages/PageError";
import { ScrollArea } from "../ui/scroll-area";
import UpdateLeagueForm from "../forms/UpdateLeagueForm";

const UpdateLeagueModal = ({ isOpen, onClose, league }) => {
  const { data: sports, isLoading: isSportsLoading, isError: isSportsError } = useSports(isOpen)

  if (isSportsLoading) return <Loading />;
  if (isSportsError) return <PageError />

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update League</DialogTitle>
          <DialogDescription>Update League.</DialogDescription>
          <ScrollArea className="max-h-[75vh]">
            <UpdateLeagueForm sports={sports} onClose={onClose} league={league} />
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateLeagueModal;
