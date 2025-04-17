import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, ChevronLeft } from "lucide-react";
import { Link } from "react-router";
import { useModal } from "@/hooks/useModal";
import CreatePlayerModal from "@/components/modals/CreatePlayerModal";

const PlayersListHeader = () => {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <header className="border-b p-4 grid grid-cols-2 grid-rows-2 items-center">
      <Link
        to="/"
        className="flex text-muted-foreground text-xs max-w-[8.5rem]"
      >
        <ChevronLeft size={18} />
        Back to Dashboard
      </Link>
      <span className="font-medium text-sm row-start-2 md:text-lg">
        Players Management
      </span>
      <Button
        onClick={openModal}
        className="ml-auto row-span-2 col-start-2 md:py-5"
        size="sm"
      >
        <UserPlus />
        Register Player
      </Button>
      <CreatePlayerModal isOpen={isOpen} onClose={closeModal} />
    </header>
  );
};

export default PlayersListHeader;
