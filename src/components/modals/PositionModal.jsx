import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import PositionForm from "../forms/PositionForm";
import { useParams } from "react-router";

const PositionModal = ({ isOpen, onClose, position = null }) => {
  const { sport } = useParams();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {position ? "Update Position" : "Create New Position"}
          </DialogTitle>
          <DialogDescription>
            {position 
              ? "Edit position details for this sport" 
              : "Add a new position to this sport"}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[75vh]">
          <PositionForm
            onClose={onClose}
            sportSlug={sport}
            position={position}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PositionModal;
