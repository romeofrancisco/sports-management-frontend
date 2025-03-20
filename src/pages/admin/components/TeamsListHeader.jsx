import React from "react";
import { Button } from "@/components/ui/button";
import { Users, ChevronLeft } from "lucide-react";
import { Link } from "react-router";
import { useModal } from "@/hooks/useModal";
import AddTeamModal from "@/components/modals/CreateTeamModal";

const TeamsListHeader = () => {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <header className="border-b py-4 grid grid-cols-2 grid-rows-2 items-center">
      <Link to="/" className="flex text-muted-foreground text-xs">
        <ChevronLeft size={18} />
        Back to Dashboard
      </Link>
      <span className="font-medium text-sm row-start-2 md:text-lg">Team Management</span>
      <Button onClick={openModal} className="ml-auto row-span-2 col-start-2 md:py-5" size="sm">
        <Users />
        Create Team
      </Button>
      <AddTeamModal isOpen={isOpen} onClose={closeModal} />
    </header>
  );
};

export default TeamsListHeader;
