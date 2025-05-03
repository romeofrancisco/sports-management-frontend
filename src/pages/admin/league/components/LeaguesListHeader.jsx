import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import LeagueModal from "@/components/modals/LeagueModal";

const LeaguesListHeader = () => {
  const { isOpen, closeModal, openModal } = useModal();

  return (
    <header className="flex items-center justify-between py-4 border-b">
      <h1 className="text-2xl font-medium">Leagues</h1>
      <Button onClick={openModal}>
        <Plus className="mr-2 h-4 w-4" />
        Create League
      </Button>
      <LeagueModal isOpen={isOpen} onClose={closeModal} />
    </header>
  );
};

export default LeaguesListHeader;
