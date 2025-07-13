import React, { useState } from "react";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import LeaderModal from "@/components/modals/LeaderModal";
import DeleteLeaderModal from "@/components/modals/DeleteLeaderModal";
import { useModal } from "@/hooks/useModal";
import { useLeaderCategories } from "@/hooks/useLeaderCategories";
import { useParams } from "react-router";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Trophy,
  X
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import ContentLoading from "@/components/common/ContentLoading";
import ContentEmpty from "@/components/common/ContentEmpty";

const LeaderCategoriesTable = () => {
  const { sport } = useParams();
  const [selectedLeaderCategory, setSelectedLeaderCategory] = useState(null);
  const [filter, setFilter] = useState({ search: "" });
  
  const { leaderCategories, isLoading } = useLeaderCategories(sport);

  const modals = {
    leader: useModal(),
    delete: useModal(),
  };

  const handleCreateLeader = () => {
    setSelectedLeaderCategory(null);
    modals.leader.openModal();
  };

  const handleEditLeader = (leader) => {
    setSelectedLeaderCategory(leader);
    modals.leader.openModal();
  };

  const handleDeleteLeader = (leader) => {
    setSelectedLeaderCategory(leader);
    modals.delete.openModal();
  };

  const clearFilter = () => {
    setFilter({ search: "" });
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Category Name",
      cell: ({ getValue }) => (
        <div className="font-medium">{getValue()}</div>
      ),
    },    {
      accessorKey: "stat_types_details",
      header: "Stats",
      cell: ({ row, getValue }) => {
        const stats = getValue() || [];
        const primaryStatId = row.original.primary_stat_id;
        
        return (
          <div className="flex flex-wrap gap-1">
            {stats.length > 0 ? (
              stats.map((stat) => (
                <Badge 
                  key={stat.id}
                  variant={stat.id === primaryStatId ? "default" : "secondary"} 
                  className={`text-xs ${stat.id === primaryStatId ? "font-semibold" : ""}`}
                >
                  {stat.name} {stat.id === primaryStatId && "★"}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-xs">No stats assigned</span>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline" 
            size="sm"
            onClick={() => handleEditLeader(row.original)}
            className="h-8 px-3"
          >
            Edit
          </Button>
          <Button
            variant="destructive" 
            size="sm" 
            onClick={() => handleDeleteLeader(row.original)}
            className="h-8 px-3"
          >
            Delete
          </Button>
        </div>
      ),
      size: 140,
    },
  ];

  const filteredLeaders = leaderCategories?.filter(leader =>
    leader.name.toLowerCase().includes(filter.search.toLowerCase())
  ) || [];

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Leader Categories
          </h2>
          <Badge variant="outline" className="bg-primary/10 font-medium">
            {filteredLeaders?.length || 0} categories
          </Badge>
        </div>
        
        <Button 
          onClick={handleCreateLeader} 
          size="sm"
          className="bg-primary hover:bg-primary/90 text-white shadow-sm"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          New Leader Category
        </Button>
      </div>

      <Card className="mb-6 shadow-sm">
        <CardHeader className="py-3 px-4 bg-muted/20">
          <div className="text-base font-semibold">Search Leader Categories</div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex gap-4 items-end max-w-md">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-leader"
                placeholder="Search by category name..."
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
                Found {filteredLeaders?.length || 0} matching categories
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {isLoading ? (
        <ContentLoading />
      ) : (
        <div className="border rounded-md overflow-hidden shadow-sm">
          <DataTable
            columns={columns}
            data={filteredLeaders || []}
            className="text-sm"
            pagination={true}
            pageSize={8}
            alternateRowColors={true}
            emptyMessage={
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Trophy className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium mb-1">No leader categories found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {filter.search
                    ? "Try adjusting your search to find leader categories"
                    : "Create leader categories to display in game and season leaderboards"}
                </p>
                <Button
                  onClick={handleCreateLeader}
                  size="sm"
                  className="bg-primary"
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  New Leader Category
                </Button>
              </div>
            }
          />
        </div>
      )}
      
      <LeaderModal
        isOpen={modals.leader.isOpen}
        onClose={modals.leader.closeModal}
        leaderCategory={selectedLeaderCategory}
      />
      <DeleteLeaderModal
        isOpen={modals.delete.isOpen}
        onClose={modals.delete.closeModal}
        leaderCategory={selectedLeaderCategory}
      />
    </div>
  );
};

export default LeaderCategoriesTable;