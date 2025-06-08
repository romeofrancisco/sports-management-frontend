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
  };  return (
    <>
      <div className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden rounded-lg min-h-[calc(100vh-10.5rem)]">
        <div className="relative p-4 md:p-6">
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
        </div>
      </div>
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
    </>
  );
};

export default SportsContainer;
