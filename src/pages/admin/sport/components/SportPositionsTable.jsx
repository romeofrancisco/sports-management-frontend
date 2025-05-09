import React, { useState } from "react";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import { useParams } from "react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SportPositionsTable = () => {
  const { sport } = useParams();
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [filter, setFilter] = useState({ search: "" });
  const [positions, setPositions] = useState([
    { name: "Point Guard", abbreviation: "PG" },
    { name: "Shooting Guard", abbreviation: "SG" },
    { name: "Small Forward", abbreviation: "SF" },
    { name: "Power Forward", abbreviation: "PF" },
    { name: "Center", abbreviation: "C" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

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

  const PositionActions = ({ position }) => (
    <div className="flex items-center justify-end space-x-2">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => handleEditPosition(position)}
      >
        Edit
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-destructive"
        onClick={() => handleDeletePosition(position)}
      >
        Delete
      </Button>
    </div>
  );

  const columns = [
    {
      accessorKey: "name",
      header: "Position Name",
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: "abbreviation",
      header: "Abbreviation",
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue()}</span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <PositionActions position={row.original} />
      ),
      size: 80,
    },
  ];

  const filteredPositions = positions.filter(position =>
    position.name.toLowerCase().includes(filter.search.toLowerCase()) ||
    position.abbreviation.toLowerCase().includes(filter.search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">Position Management</h2>
        <Button onClick={handleCreatePosition}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Position
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 max-w-md">
            <div>
              <Label htmlFor="search-position">Search Position</Label>
              <Input
                id="search-position"
                placeholder="Search by position name or abbreviation..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="border rounded-md overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredPositions || []}
          loading={isLoading}
          className="text-sm"
          pagination={true}
          pageSize={8}
        />
      </div>
      
      {/* Position Modal Placeholder - implement actual modal component later */}
      {/* <PositionModal
        isOpen={modals.position.isOpen}
        onClose={modals.position.closeModal}
        position={selectedPosition}
      />
      <DeletePositionModal
        isOpen={modals.delete.isOpen}
        onClose={modals.delete.closeModal}
        position={selectedPosition}
      /> */}
    </div>
  );
};

export default SportPositionsTable;