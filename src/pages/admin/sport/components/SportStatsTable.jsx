import React, { useState } from "react";
import { useSportStats } from "@/hooks/useStats";
import DataTable from "@/components/common/DataTable";
import { useParams } from "react-router";
import SportStatsFilterBar from "./SportStatsFilterBar";
import { Button } from "@/components/ui/button";
import SportStatsModal from "@/components/modals/SportStatsModal";
import { useModal } from "@/hooks/useModal";
import DeleteStatModal from "@/components/modals/DeleteStatModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, Table as TableIcon } from "lucide-react";

// Import column definitions
import getEssentialColumns from "./columns/EssentialColumns";
import getCategoryColumns from "./columns/CategoryColumns";
import getDisplayColumns from "./columns/DisplayColumns";
import getRecordingColumns from "./columns/RecordingColumns";
import SportStatsCardView from "./SportStatsCardView";

const SportStatsTable = () => {
  const { sport } = useParams();
  const [selectedStat, setSelectedStat] = useState(null);
  const [filter, setFilter] = useState({ search: "" });
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'cards'
  const [activeTab, setActiveTab] = useState("essential");

  const { data: stats, isLoading: isStatsLoading } = useSportStats(
    sport,
    filter
  );

  const modals = {
    stat: useModal(),
    delete: useModal(),
  };

  const handleCreateStat = () => {
    setSelectedStat(null);
    modals.stat.openModal();
  };

  const handleEditStat = (stat) => {
    setSelectedStat(stat);
    modals.stat.openModal();
  };

  const handleDeleteStat = (stat) => {
    setSelectedStat(stat);
    modals.delete.openModal();
  };

  // Get columns for each tab using the imported functions
  const essentialColumns = getEssentialColumns({
    setSelectedStat,
    modals,
    filter,
  });
  const categoryColumns = getCategoryColumns({ setSelectedStat, modals });
  const displayColumns = getDisplayColumns({ setSelectedStat, modals });
  const recordingColumns = getRecordingColumns({
    setSelectedStat,
    modals,
    filter,
  });

  return (
    <div className="px-5 md:border max-w-screen md:bg-muted/30 md:p-5 lg:p-8 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl semibold">Stats Types</h1>
        <Button onClick={handleCreateStat}>Create New Stat</Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        <SportStatsFilterBar filter={filter} setFilter={setFilter} />

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="flex items-center gap-1"
          >
            <TableIcon className="h-4 w-4" /> Table
          </Button>
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("cards")}
            className="flex items-center gap-1"
          >
            <LayoutGrid className="h-4 w-4" /> Cards
          </Button>
        </div>
      </div>

      {viewMode === "table" ? (
        <Tabs
          defaultValue="essential"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList>
            <TabsTrigger className="text-xs " value="essential">
              Essential Info
            </TabsTrigger>
            <TabsTrigger className="text-xs " value="category">
              Categories
            </TabsTrigger>
            <TabsTrigger className="text-xs " value="display">
              Display Settings
            </TabsTrigger>
            <TabsTrigger className="text-xs " value="recording">
              Recording
            </TabsTrigger>
          </TabsList>

          <TabsContent value="essential" className="mt-0">
            <DataTable
              columns={essentialColumns}
              data={stats || []}
              loading={isStatsLoading}
              className="text-xs"
            />
          </TabsContent>

          <TabsContent value="category" className="mt-0">
            <DataTable
              columns={categoryColumns}
              data={stats || []}
              loading={isStatsLoading}
              className="text-xs"
            />
          </TabsContent>

          <TabsContent value="display" className="mt-0">
            <DataTable
              columns={displayColumns}
              data={stats || []}
              loading={isStatsLoading}
              className="text-xs"
            />
          </TabsContent>

          <TabsContent value="recording" className="mt-0">
            <DataTable
              columns={recordingColumns}
              data={stats || []}
              loading={isStatsLoading}
              className="text-xs"
            />
          </TabsContent>
        </Tabs>
      ) : (
        <SportStatsCardView
          stats={stats}
          filter={filter}
          handleEditStat={handleEditStat}
          handleDeleteStat={handleDeleteStat}
        />
      )}

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
