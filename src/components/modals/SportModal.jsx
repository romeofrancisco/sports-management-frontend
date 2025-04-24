import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SportForm from "../forms/SportForm";

const SportModal = ({ isOpen, onClose, sport }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Register New Sport</DialogTitle>
          <DialogDescription></DialogDescription>
          <SportForm onClose={onClose} sport={sport} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SportModal;
