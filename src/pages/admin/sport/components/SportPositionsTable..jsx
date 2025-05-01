import DataTable from "@/components/common/DataTable";
import { useSportPositions } from "@/hooks/useSports";
import React, { useState } from "react";
import { useParams } from "react-router";
import getSportPositionsColumn from "./SportPositionColumns";
import { Button } from "@/components/ui/button";
import { SearchFilter } from "@/components/common/Filters";
import { useModal } from "@/hooks/useModal";
import PostitionModal from "@/components/modals/PositionModal";
import DeletePositionModal from "@/components/modals/DeletePositionModal";

const SportPositionsTable = () => {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [filter, setFilter] = useState({ search: "" });
  const { sport } = useParams();
  const { data: positions, isLoading } = useSportPositions(sport);

  const modals = {
    position: useModal(),
    delete: useModal(),
  };

  const handleCreatePosition = () => {
    setSelectedPosition(null);
    modals.position.openModal();
  };

  const columns = getSportPositionsColumn({ setSelectedPosition, modals });

  return (
    <div className="px-5 max-w-screen md:border md:bg-muted/30 md:p-5 lg:p-8 rounded-lg">
      <div className="flex w-full justify-between items-center mb-6 gap-1">
        <h1 className="text-3xl semibold">Positions</h1>
        <Button onClick={handleCreatePosition}>Create New Position</Button>
      </div>
      <SearchFilter
        value={filter.search}
        onChange={(search) => setFilter((prev) => ({ ...prev, search }))}
      />
      <DataTable columns={columns} data={positions || []} loading={isLoading} />
      <PostitionModal
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

export default SportPositionsTable;
