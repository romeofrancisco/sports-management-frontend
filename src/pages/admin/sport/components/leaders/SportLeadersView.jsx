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
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Leaders
          </h2>
          <Badge variant="outline" className="bg-primary/10 text-primary w-fit">
            {filteredLeaders.length} categories
          </Badge>
        </div>
        <Button 
          onClick={handleCreateLeader}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white"
        >
          <Plus className="h-4 w-4" />
          New Leader Category
        </Button>
      </div>

      {/* Content Section */}
      <div className="bg-background">
        <Card className="shadow-sm border rounded-lg overflow-hidden">
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
        </Card>
      </div>

      {/* Modals */}
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
