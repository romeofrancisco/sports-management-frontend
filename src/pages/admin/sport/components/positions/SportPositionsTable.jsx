import React from "react";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Edit, Trash2 } from "lucide-react";
import ContentLoading from "@/components/common/ContentLoading";

const SportPositionsTable = ({ 
  positions, 
  filter, 
  modals, 
  selectedPosition,
  setSelectedPosition,
  onEdit,
  onDelete,
  isLoading
}) => {
  const handleCreatePosition = () => {
    setSelectedPosition(null);
    modals.position.openModal();
  };

  const PositionActions = ({ position }) => (
    <div className="flex items-center justify-end space-x-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onEdit(position)}
        className="h-8 px-3"
      >
        <Edit className="h-3 w-3 mr-1" />
        Edit
      </Button>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => onDelete(position)}
        className="h-8 px-3"
      >
        <Trash2 className="h-3 w-3 mr-1" />
        Delete
      </Button>
    </div>
  );

  const columns = [
    {
      accessorKey: "name",
      header: "Position Name",
      cell: ({ getValue }) => (
        <div className="font-medium">{getValue()}</div>
      ),
    },
    {
      accessorKey: "abbreviation",
      header: "Abbreviation",
      cell: ({ getValue }) => (
        <Badge variant="outline" className="font-mono">
          {getValue() || "N/A"}
        </Badge>
      ),
      size: 120,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ getValue }) => (
        <div className="text-sm text-muted-foreground">
          {getValue() || "No description"}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <PositionActions position={row.original} />
      ),
      size: 180,
    },
  ];

  if (isLoading) {
    return <ContentLoading />;
  }

  return (
    <div className="border rounded-md overflow-hidden shadow-sm">
      <DataTable
        columns={columns}
        data={positions || []}
        loading={isLoading}
        className="text-sm"
        pagination={false}
        unlimited={true}
        emptyMessage={
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Users className="h-8 w-8 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium mb-1">No positions found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {filter.search
                ? "Try adjusting your search to find positions"
                : "Create your first position to define player roles"}
            </p>
            <Button
              onClick={handleCreatePosition}
              size="sm"
              className="bg-primary"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              New Position
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default SportPositionsTable;