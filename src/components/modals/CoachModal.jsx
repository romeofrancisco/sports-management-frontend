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
import CoachForm from "../forms/CoachForm";

const CoachModal = ({ isOpen, onClose, coach }) => {
  const isEdit = !!coach

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Update Coach" : "Register New Coach" }</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Separator className="min-h-px" />
        <ScrollArea className="max-h-[75vh]">
          <CoachForm onClose={onClose} coach={coach} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CoachModal;
