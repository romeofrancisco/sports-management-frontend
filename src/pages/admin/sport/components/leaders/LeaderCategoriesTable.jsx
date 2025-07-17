import React from "react";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Plus, Edit, Trash2 } from "lucide-react";
import ContentLoading from "@/components/common/ContentLoading";
import ContentEmpty from "@/components/common/ContentEmpty";

const LeaderCategoriesTable = ({ 
  leaderCategories, 
  filter, 
  modals, 
  selectedLeaderCategory,
  setSelectedLeaderCategory,
  onEdit,
  onDelete,
  isLoading
}) => {
  const handleCreateLeader = () => {
    setSelectedLeaderCategory(null);
    modals.leader.openModal();
  };

  const LeaderActions = ({ leader }) => (
    <div className="flex items-center justify-end space-x-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onEdit(leader)}
        className="h-8 px-3"
      >
        <Edit className="h-3 w-3 mr-1" />
        Edit
      </Button>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => onDelete(leader)}
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
      header: "Category Name",
      cell: ({ getValue }) => (
        <div className="font-medium">{getValue()}</div>
      ),
    },
    {
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
        <LeaderActions leader={row.original} />
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
        data={leaderCategories || []}
        loading={isLoading}
        className="text-sm"
        pagination={false}
        unlimited={true}
        emptyMessage={
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Trophy className="h-8 w-8 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium mb-1">No leader categories found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {filter.search
                ? "Try adjusting your search to find categories"
                : "Create your first leader category to track top performers"}
            </p>
            <Button
              onClick={handleCreateLeader}
              size="sm"
              className="bg-primary"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              New Category
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default LeaderCategoriesTable;