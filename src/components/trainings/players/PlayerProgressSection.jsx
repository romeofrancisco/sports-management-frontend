import React, { useState } from "react";
import {
  SportFilter,
  TeamFilter,
  DateFilter,
  PlayerFilter,
} from "../dashboard/TrainingDashboardFilter";
import { Button } from "@/components/ui/button";
import {
  PlayerProgressChart,
  PlayerProgressMultiView,
} from "./player-progress-components";
import PlayerMetricRecorderModal from "@/components/modals/PlayerMetricRecorderModal";
import { useSports } from "@/hooks/useSports";
import { useSportTeams } from "@/hooks/useTeams";
import { useTeamPlayers } from "@/hooks/useTeams";
import { useModal } from "@/hooks/useModal";

const initialState = {
  selectedSport: null,
  selectedTeam: null,
  selectedPlayer: null,
  dateRange: {
    from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    to: new Date(),
  },
  showMetricRecorder: false,
  selectedPlayerTrainingContext: null,
};

const PlayerProgressSection = () => {
  const [filter, setFilter] = useState(initialState);
  const { data: sports, isLoading: isSportsLoading } = useSports();
  const { data: teams, isLoading: isTeamsLoading } = useSportTeams(filter.selectedSport);
  const { data: players = [], isLoading: isPlayersLoading } = useTeamPlayers(filter.selectedTeam);

  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Player Progress Tracking</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <SportFilter
            sports={sports}
            selectedSport={filter.selectedSport}
            setSelectedSport={(selectedSport) =>
              setFilter((prev) => ({ ...prev, selectedSport }))
            }
          />
          <TeamFilter
            teams={teams}
            selectedTeam={filter.selectedTeam}
            setSelectedTeam={(selectedTeam) =>
              setFilter((prev) => ({ ...prev, selectedTeam }))
            }
          />
          <DateFilter
            dateRange={filter.dateRange}
            setDateRange={(dateRange) =>
              setFilter((prev) => ({ ...prev, dateRange }))
            }
          />
          <PlayerFilter
            players={players}
            selectedPlayer={filter.selectedPlayer}
            setSelectedPlayer={(selectedPlayer) =>
              setFilter((prev) => ({ ...prev, selectedPlayer }))
            }
            isLoading={filter.isPlayersLoading}
          />
          {filter.selectedPlayer && filter.selectedPlayer !== "all_players" && (
            <Button
              variant="default"
              onClick={openModal}
              disabled={filter.isPlayerTrainingsLoading}
            >
              Record Metrics
            </Button>
          )}
        </div>
      </div>
      {filter.selectedPlayer && filter.selectedPlayer !== "all_players" ? (
        <PlayerProgressChart playerId={filter.selectedPlayer} />
      ) : (
        <PlayerProgressMultiView
          players={players.map((p) => ({ id: p.id, name: p.name }))}
          teamId={filter.selectedTeam}
        />
      )}
      <PlayerMetricRecorderModal
        open={isOpen}
        onClose={closeModal}
        player={filter.selectedPlayer}
      />
    </div>
  );
};

export default PlayerProgressSection;
