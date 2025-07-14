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
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Positions
          </h2>
          <Badge variant="outline" className="bg-primary/10 text-primary w-fit">
            {filteredPositions.length} positions
          </Badge>
        </div>
        <Button 
          onClick={handleCreatePosition}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white"
        >
          <Plus className="h-4 w-4" />
          New Position
        </Button>
      </div>

      {/* Content Section */}
      <div className="bg-background">
        <Card className="shadow-sm border rounded-lg overflow-hidden">
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
        </Card>
      </div>

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
