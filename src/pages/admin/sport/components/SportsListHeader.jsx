import React from "react";
import { Link } from "react-router";
import { ChevronLeft, Plus } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import SportModal from "@/components/modals/SportModal";
import { Button } from "@/components/ui/button";

const SportsListHeader = () => {
  const { isOpen, closeModal, openModal } = useModal();

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
        Sports Management
      </span>
      <Button
        onClick={openModal}
        className="ml-auto row-span-2 col-start-2 md:py-5"
        size="sm"
      >
        <Plus />
        Register Sport
      </Button>
      <SportModal isOpen={isOpen} onClose={closeModal} />
    </header>
  );
};

export default SportsListHeader;
