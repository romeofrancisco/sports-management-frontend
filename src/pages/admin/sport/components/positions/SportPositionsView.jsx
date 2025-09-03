import React, { useState } from "react";
import SportPositionsTable from "./SportPositionsTable";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";
import { useSportPositions } from "@/hooks/useSports";
import { useParams } from "react-router";
import { useModal } from "@/hooks/useModal";
import PositionModal from "@/components/modals/PositionModal";
import DeletePositionModal from "@/components/modals/DeletePositionModal";

const SportPositionsView = () => {
  const { sport } = useParams();
  const [filter, setFilter] = useState({ search: "" });
  const [selectedPosition, setSelectedPosition] = useState(null);

  const { data: positions, isLoading } = useSportPositions(sport);
  const filteredPositions = positions || [];

  const modals = {
    position: useModal(),
    delete: useModal(),
  };

  const handleCreatePosition = () => {
    setSelectedPosition(null);
    modals.position.openModal();
  };

  const handleEditPosition = (position) => {
    setSelectedPosition(position);
    modals.position.openModal();
  };

  const handleDeletePosition = (position) => {
    setSelectedPosition(position);
    modals.delete.openModal();
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg border border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <Users className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xl font-bold">Positions</span>

            <span className="text-muted-foreground line-clamp-1 text-sm">
              Manage player positions for {sport || "this sport"}.
            </span>
          </div>
        </div>
        <Button
          onClick={handleCreatePosition}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white"
        >
          <Plus className="h-4 w-4" />
          New Position
        </Button>
      </div>

      <SportPositionsTable
        positions={filteredPositions}
        filter={filter}
        modals={modals}
        selectedPosition={selectedPosition}
        setSelectedPosition={setSelectedPosition}
        onEdit={handleEditPosition}
        onDelete={handleDeletePosition}
        isLoading={isLoading}
      />

      {/* Modals */}
      <PositionModal
        isOpen={modals.position.isOpen}
        onClose={modals.position.closeModal}
        position={selectedPosition}
      />
      <DeletePositionModal
        isOpen={modals.delete.isOpen}
        onClose={modals.delete.closeModal}
        position={selectedPosition}
      />
    </div>
  );
};

export default SportPositionsView;
