import React, { useState } from "react";
import LeaderCategoriesTable from "./LeaderCategoriesTable";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Plus } from "lucide-react";
import { useLeaderCategories } from "@/hooks/useLeaderCategories";
import { useParams } from "react-router";
import { useModal } from "@/hooks/useModal";
import LeaderModal from "@/components/modals/LeaderModal";
import DeleteLeaderModal from "@/components/modals/DeleteLeaderModal";

const SportLeadersView = () => {
  const { sport } = useParams();
  const [filter, setFilter] = useState({ search: "" });
  const [selectedLeaderCategory, setSelectedLeaderCategory] = useState(null);

  const { leaderCategories, isLoading } = useLeaderCategories(sport);
  const filteredLeaders = leaderCategories || [];

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

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg border border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <Trophy className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xl font-bold">Leader Categories</span>
            <span className="text-muted-foreground line-clamp-1 text-sm">
              Manage leader categories for {sport || "this sport"}. Leader categories help identify players who excel in specific statistics such as points, rebounds, assists, and more.
            </span>
          </div>
        </div>
        <Button
          onClick={handleCreateLeader}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white"
        >
          <Plus className="h-4 w-4" />
          New Leader Category
        </Button>
      </div>

      <LeaderCategoriesTable
        leaderCategories={filteredLeaders}
        filter={filter}
        modals={modals}
        selectedLeaderCategory={selectedLeaderCategory}
        setSelectedLeaderCategory={setSelectedLeaderCategory}
        onEdit={handleEditLeader}
        onDelete={handleDeleteLeader}
        isLoading={isLoading}
      />
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

export default SportLeadersView;
