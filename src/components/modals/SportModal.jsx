import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SportForm from "../forms/SportForm";
import { ScrollArea } from "../ui/scroll-area";

const SportModal = ({ isOpen, onClose, sport }) => {
  const isEdit = !!sport;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Sport Settings" : "Register New Sport"}
          </DialogTitle>
          <DialogDescription>
            {isEdit 
              ? "Update the settings for this sport" 
              : "Fill in the details to register a new sport"
            }
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[75vh]">
          <SportForm onClose={onClose} sport={sport} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SportModal;
