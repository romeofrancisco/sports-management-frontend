import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PlayerMetricRecorder from "../trainings/players/PlayerMetricRecorder";

const PlayerMetricRecorderModal = ({ open, onClose, player }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Record Metrics</DialogTitle>
      </DialogHeader>
      <PlayerMetricRecorder
        player={player}
        onClose={onClose}
      />
    </DialogContent>
  </Dialog>
);

export default PlayerMetricRecorderModal;
