import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, ChevronLeft } from "lucide-react";
import { Link } from "react-router";
import { useModal } from "@/hooks/useModal";
import CreatePlayerModal from "@/components/modals/PlayerModal";
import PageHeader from "@/components/common/PageHeader";

const PlayersListHeader = () => {
  const { isOpen, openModal, closeModal } = useModal();

  const actionComponent = (
    <Button
      onClick={openModal}
      className="w-full sm:w-auto"
      size="sm"
    >
      <UserPlus />
      Register Player
    </Button>
  );

  return (
    <div className="border-b p-4">
      <PageHeader 
        title="Players Management"
        description="Register and manage players across all teams"
        actionComponent={actionComponent}
      />
      <CreatePlayerModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
};

export default PlayersListHeader;
