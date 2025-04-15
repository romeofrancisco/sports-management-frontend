import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useDebounce } from "use-debounce";

import { useTeams } from "@/hooks/useTeams";
import { useModal } from "@/hooks/useModal";

import Loading from "@/components/common/Loading";
import PageError from "@/pages/PageError";
import DeleteTeamModal from "@/components/modals/DeleteTeamModal";
import UpdateTeamModal from "@/components/modals/UpdateTeamModal";

import TeamFiltersBar from "./TeamFiltersBar";
import TeamCard from "./TeamCard.jsx";

const TeamsContainer = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [filter, setFilter] = useState({ search: "", sport: "all", division: "all" });
  const [debouncedSearch] = useDebounce(filter.search, 500);
  const debouncedFilter = { ...filter, search: debouncedSearch };

  const { data: teams, isLoading, isError } = useTeams(debouncedFilter);
  const deleteModal = useModal();
  const updateModal = useModal();
  const navigate = useNavigate();

  if (isLoading) return <Loading />;
  if (isError) return <PageError />;

  return (
    <div className="border md:bg-muted/30 pt-5 md:p-5 lg:p-8 my-5 rounded-lg">
      <TeamFiltersBar filter={filter} setFilter={setFilter} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            onView={() => navigate(`/teams/${team.slug}`)}
            onEdit={() => {
              setSelectedTeam(team);
              updateModal.openModal();
            }}
            onDelete={() => {
              setSelectedTeam(team);
              deleteModal.openModal();
            }}
          />
        ))}
      </div>

      <DeleteTeamModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        team={selectedTeam}
      />
      <UpdateTeamModal
        isOpen={updateModal.isOpen}
        onClose={updateModal.closeModal}
        team={selectedTeam}
      />
    </div>
  );
};

export default TeamsContainer;
