import React, { useState } from "react";
import { useSportStats } from "@/hooks/useStats";
import DataTable from "@/components/common/DataTable";
import { useParams } from "react-router";
import { Button } from "@/components/ui/button";
import SportStatsModal from "@/components/modals/SportStatsModal";
import { useModal } from "@/hooks/useModal";
import DeleteStatModal from "@/components/modals/DeleteStatModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Filter, CheckCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Import column definitions
import { 
  getEssentialColumns,
  getDisplayColumns,
  getRecordingColumns
} from "../columns";

const SportStatsTable = ({ filter }) => {
  const { sport } = useParams();
  const [selectedStat, setSelectedStat] = useState(null);
  const [activeTab, setActiveTab] = useState("essential");

  // Use the passed filter if provided, otherwise use a default filter
  const tableFilter = filter || { search: "", category: "all", type: "all" };
  
  // Transform the filter for the API - now using backend filtering
  const apiFilter = {
    search: tableFilter.search || undefined,
    category: tableFilter.category !== "all" ? tableFilter.category : undefined,
    type: tableFilter.type !== "all" ? tableFilter.type : undefined,
  };

  const { data: stats, isLoading: isStatsLoading } = useSportStats(
    sport,
    apiFilter
  );

  const modals = {
    stat: useModal(),
    delete: useModal(),
  };

  const handleCreateStat = () => {
    setSelectedStat(null);
    modals.stat.openModal();
  };

  // Get columns for each tab using the imported functions
  const essentialColumns = getEssentialColumns({
    setSelectedStat,
    modals,
    filter: apiFilter,
  });
  const displayColumns = getDisplayColumns({ setSelectedStat, modals });
  const recordingColumns = getRecordingColumns({
    setSelectedStat,
    modals,
    filter: apiFilter,
  });

  // No need for additional client-side filtering since backend handles it all
  const filteredStats = stats || [];
  
  // Function to get active filters count for badge
  const getActiveFiltersCount = () => {
    let count = 0;
    if (tableFilter.search) count++;
    if (tableFilter.category !== "all") count++;
    if (tableFilter.type !== "all") count++;
    return count;
  };

  // Function to get filter names for tooltip
  const getFilterNames = () => {
    const filters = [];
    if (tableFilter.search) filters.push(`Search: "${tableFilter.search}"`);
    if (tableFilter.category !== "all") {
      const categoryName = {
        "scoring": "Scoring Stats",
        "performance": "Performance Metrics", 
        "actions": "Action Stats"
      }[tableFilter.category] || tableFilter.category;
      filters.push(`Category: ${categoryName}`);
    }
    if (tableFilter.type !== "all") {
      const typeName = {
        "basic": "Basic Stats",
        "advanced": "Advanced Stats"
      }[tableFilter.type] || tableFilter.type;
      filters.push(`Type: ${typeName}`);
    }
    return filters.join(", ");
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg">Table View</h3>
          <Badge variant="outline" className="bg-primary/10 font-medium">
            {filteredStats.length} stats
          </Badge>
          {getActiveFiltersCount() > 0 && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1.5 bg-secondary/80"
              title={getFilterNames()}
            >
              <Filter className="h-3 w-3" />
              {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        <Button 
          onClick={handleCreateStat} 
          size="sm"
          className="bg-primary hover:bg-primary/90 text-white shadow-sm"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          New Stat
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden shadow-sm">
        <Tabs
          defaultValue="essential"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="bg-muted/30 border-b">
            <TabsList className="p-1 bg-transparent justify-start h-12">
              <TabsTrigger 
                value="essential" 
                className="text-xs md:text-sm flex items-center gap-1.5"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Essential Info
              </TabsTrigger>
              <TabsTrigger 
                value="display" 
                className="text-xs md:text-sm flex items-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Display Settings
              </TabsTrigger>
              <TabsTrigger 
                value="recording" 
                className="text-xs md:text-sm flex items-center gap-1.5"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Recording Settings
              </TabsTrigger>
            </TabsList>
          </div>          <TabsContent value="essential" className="space-y-0">
            <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
              <DataTable
                columns={essentialColumns}
                data={filteredStats || []}
                loading={isStatsLoading}
                className="text-sm"
                pagination={false}
                unlimited={true}
                alternateRowColors={true}
              />
            </div>
          </TabsContent>

          <TabsContent value="display" className="space-y-0">
            <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
              <DataTable
                columns={displayColumns}
                data={filteredStats || []}
                loading={isStatsLoading}
                className="text-sm"
                pagination={false}
                unlimited={true}
                alternateRowColors={true}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="recording" className="space-y-0">
            <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
              <DataTable
                columns={recordingColumns}
                data={filteredStats || []}
                loading={isStatsLoading}
                className="text-sm"
                pagination={false}
                unlimited={true}
                alternateRowColors={true}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <SportStatsModal
        isOpen={modals.stat.isOpen}
        onClose={modals.stat.closeModal}
        stat={selectedStat}
      />
      <DeleteStatModal
        isOpen={modals.delete.isOpen}
        onClose={modals.delete.closeModal}
        stat={selectedStat}
      />
    </div>
  );
};

export default SportStatsTable;
