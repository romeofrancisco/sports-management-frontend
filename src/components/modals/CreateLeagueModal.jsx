import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSports } from "@/hooks/useSports";
import Loading from "../common/FullLoading";
import CreateLeagueForm from "../forms/CreateLeagueForm";
import PageError from "@/pages/PageError";
import { ScrollArea } from "../ui/scroll-area";

const CreateLeagueModal = ({ isOpen, onClose }) => {
  const { data: sports, isLoading: isSportsLoading, isError: isSportsError } = useSports(isOpen)


  if (isSportsLoading) return <Loading />;
  if (isSportsError) return <PageError />

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Create League</DialogTitle>
          <DialogDescription>Create League.</DialogDescription>
          <ScrollArea className="max-h-[75vh]">
            <CreateLeagueForm sports={sports} onClose={onClose} />
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeagueModal;
