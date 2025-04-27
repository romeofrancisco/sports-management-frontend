import React, { useState } from "react";
import SportCard from "./SportCard";
import { useSports } from "@/hooks/useSports";
import ContentLoading from "@/components/common/ContentLoading";
import SportModal from "@/components/modals/SportModal";
import { useModal } from "@/hooks/useModal";
import DeleteSportModal from "@/components/modals/DeleteSportModal";

const SportsContainer = () => {
  const [selectedSport, setSelectedSport] = useState(null);
  const { data: sports, isLoading } = useSports();

  const modals = {
    update: useModal(),
    delete: useModal(),
  };

  const handleUpdateSport = (sport) => {
    setSelectedSport(sport);
    modals.update.openModal();
  };

  const handleDeleteSport = (sport) => {
    setSelectedSport(sport);
    modals.delete.openModal();
  };

  return (
    <div className="border grid md:bg-muted/30 pt-5 md:p-5 lg:p-8 my-5 rounded-lg min-h-[calc(100vh-10.5rem)]">
      {isLoading ? (
        <ContentLoading />
      ) : (
        <div className="grid gap-5 lg:grid-cols-4 md:grid-cols-2">
          {sports.map((sport) => (
            <SportCard
              key={sport.id}
              sport={sport}
              onEdit={handleUpdateSport}
              onDelete={handleDeleteSport}
            />
          ))}
        </div>
      )}
      <SportModal
        sport={selectedSport}
        isOpen={modals.update.isOpen}
        onClose={modals.update.closeModal}
      />
      <DeleteSportModal
        sport={selectedSport}
        isOpen={modals.delete.isOpen}
        onClose={modals.delete.closeModal}
      />
    </div>
  );
};

export default SportsContainer;
