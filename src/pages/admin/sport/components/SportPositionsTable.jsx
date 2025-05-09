import React, { useState } from "react";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import { useParams } from "react-router";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  LineChart, 
  X,
  Users
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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

  const clearFilter = () => {
    setFilter({ search: "" });
  };

  const PositionActions = ({ position }) => (
    <div className="flex items-center justify-end space-x-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => handleEditPosition(position)}
        className="h-8 px-3"
      >
        Edit
      </Button>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => handleDeletePosition(position)}
        className="h-8 px-3"
      >
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
        <Badge variant="outline" className="font-mono bg-muted/40">
          {getValue()}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <PositionActions position={row.original} />
      ),
      size: 140,
    },
  ];

  const filteredPositions = positions.filter(position =>
    position.name.toLowerCase().includes(filter.search.toLowerCase()) ||
    position.abbreviation.toLowerCase().includes(filter.search.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Position Management
          </h2>
          <Badge variant="outline" className="bg-primary/10 font-medium">
            {filteredPositions?.length || 0} positions
          </Badge>
        </div>
        
        <Button 
          onClick={handleCreatePosition} 
          size="sm"
          className="bg-primary hover:bg-primary/90 text-white shadow-sm"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          New Position
        </Button>
      </div>

      <Card className="mb-6 shadow-sm">
        <CardHeader className="py-3 px-4 bg-muted/20">
          <div className="text-base font-semibold">Search Positions</div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex gap-4 items-end max-w-md">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-position"
                placeholder="Search by position name or abbreviation..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                className="pl-9 bg-background"
              />
            </div>
            {filter.search && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilter}
                className="flex items-center gap-1 h-9 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
          
          {filter.search && (
            <div className="flex items-center gap-2 mt-4">
              <Badge variant="secondary" className="flex items-center gap-1.5 bg-secondary/80 pl-2">
                <span>Search: {filter.search}</span>
                <button 
                  onClick={clearFilter}
                  className="ml-1 rounded-full hover:bg-muted p-0.5"
                  aria-label="Clear search filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
              
              <div className="text-sm text-muted-foreground">
                Found {filteredPositions?.length || 0} matching positions
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="border rounded-md overflow-hidden shadow-sm">
        <DataTable
          columns={columns}
          data={filteredPositions || []}
          loading={isLoading}
          className="text-sm"
          pagination={true}
          pageSize={8}
          alternateRowColors={true}
          emptyMessage={
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <LineChart className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium mb-1">No positions found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {filter.search
                  ? "Try adjusting your search to find positions"
                  : "Create your first position to assign to players"}
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