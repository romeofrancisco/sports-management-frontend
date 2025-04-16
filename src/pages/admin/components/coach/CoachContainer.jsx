import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import CoachFilterBar from "./CoachFilterBar";
import { useCoaches } from "@/hooks/useCoaches";
import PageError from "@/pages/PageError";
import ContentLoading from "@/components/common/ContentLoading";
import DeleteCoachModal from "@/components/modals/DeleteCoachModal";
import CoachModal from "@/components/modals/CreateCoachModal";
import CoachCard from "./CoachCard";
import { useModal } from "@/hooks/useModal";

const CoachContainer = () => {
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [filter, setFilter] = useState({ search: "", sex: "" });

  const { data: coaches, isLoading, isError } = useCoaches(filter);

  const modals = {
    delete: useModal(),
    update: useModal(),
  }

  const handleDeleteCoach = (coach) => {
    setSelectedCoach(coach);
    modals.delete.openModal()
  };

  const handleUpdateCoach = (coach) => {
    setSelectedCoach(coach);
    modals.update.openModal()
  };

  if (isError) return <PageError />;

  return (
    <div className="px-4 md:p-5 lg:p-8 md:border md:bg-muted/30 my-5 rounded-lg">
      <CoachFilterBar filter={filter} setFilter={setFilter} />
      <Separator className="max-h-[0.5px] mt-5 mb-8" />
      {isLoading ? (
        <ContentLoading />
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {coaches.map((coach) => (
            <CoachCard
              key={coach.id}
              coach={coach}
              onDelete={handleDeleteCoach}
              onUpdate={handleUpdateCoach}
            />
          ))}
        </div>
      )}
      <CoachModal
        isOpen={modals.update.isOpen}
        onClose={modals.update.closeModal}
        coach={selectedCoach}
      />
      <DeleteCoachModal
        isOpen={modals.delete.isOpen}
        onClose={modals.delete.closeModal}
        coach={selectedCoach}
      />
    </div>
  );
};

export default CoachContainer;
