import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import LeagueModal from "@/components/modals/LeagueModal";
import PageHeader from "@/components/common/PageHeader";

const LeaguesListHeader = () => {
  const { isOpen, closeModal, openModal } = useModal();

  const actionComponent = (
    <Button onClick={openModal} className="w-full sm:w-auto">
      <Plus className="mr-2 h-4 w-4" />
      Create League
    </Button>
  );

  return (
    <div className="py-4 border-b">
      <PageHeader 
        title="Leagues"
        description="Create and manage sports leagues and competitions"
        actionComponent={actionComponent}
      />
      <LeagueModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
};

export default LeaguesListHeader;
