import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import CreateCoachForm from "../forms/CreateCoachForm";

const CreateCoachModal = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Register New Coach</DialogTitle>
          <DialogDescription>Register new coach</DialogDescription>
        </DialogHeader>
        <Separator className="min-h-px" />
        <ScrollArea className="max-h-[75vh]">
          <CreateCoachForm onClose={onClose} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCoachModal;
