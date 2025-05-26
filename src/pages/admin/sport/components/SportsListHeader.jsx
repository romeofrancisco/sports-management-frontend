import React from "react";
import { Link } from "react-router";
import { ChevronLeft, Plus } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import SportModal from "@/components/modals/SportModal";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/PageHeader";

const SportsListHeader = () => {
  const { isOpen, closeModal, openModal } = useModal();

  const actionComponent = (
    <Button
      onClick={openModal}
      className="w-full sm:w-auto"
      size="sm"
    >
      <Plus />
      Register Sport
    </Button>
  );

  return (
    <div className="border-b p-4">
      <PageHeader 
        title="Sports Management"
        description="Manage and organize sports in your system"
        actionComponent={actionComponent}
      />
      <SportModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
};


export default SportsListHeader;
