import React, { useState } from "react";
import { useSportStats } from "@/hooks/useStats";
import DataTable from "@/components/common/DataTable";
import getSportStatsColumn from "./SportStatsColumns";
import { useParams } from "react-router";
import SportStatsFilterBar from "./SportStatsFilterBar";
import { Button } from "@/components/ui/button";
import SportStatsModal from "@/components/modals/SportStatsModal";
import { useModal } from "@/hooks/useModal";
import DeleteStatModal from "@/components/modals/DeleteStatModal";
import { Card, CardContent } from "@/components/ui/card";

const SportStatsTable = () => {
  const { sport } = useParams();
  const [selectedStat, setSelectedStat] = useState(null);
  const [filter, setFilter] = useState({
    search: "",
    is_record: true, //True if the stat is recordable
  });

  const { data: stats, isLoading: isStatsLoading } = useSportStats(
    sport,
    filter
  );

  const modals = {
    stat: useModal(),
    delete: useModal(),
  };

  const columns = getSportStatsColumn({ setSelectedStat, filter, modals });

  const handleCreateStat = () => {
    setSelectedStat(null);
    modals.stat.openModal();
  };

  return (
    <div className="px-5 md:border max-w-screen md:bg-muted/30 md:p-5 lg:p-8 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl semibold">Stats Types</h1>
        <Button onClick={handleCreateStat}>Create New Stat</Button>
      </div>
      <SportStatsFilterBar filter={filter} setFilter={setFilter} />
      <DataTable
        columns={columns}
        data={stats || []}
        loading={isStatsLoading}
        className="text-xs md:text-sm"
      />
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
