import { useState } from "react";
import { useNavigate } from "react-router";
import { useModal } from "@/hooks/useModal";
import DataTable from "@/components/common/DataTable";
import PageError from "@/pages/PageError";
import { useGames } from "@/hooks/useGames";
import { GAME_STATUS_VALUES, GAME_TYPE_VALUES } from "@/constants/game";
import UpdateGameModal from "@/components/modals/UpdateGameModal";
import DeleteGameModal from "@/components/modals/DeleteGameModal";
import StartingLineupModal from "@/components/modals/StartingLineupModal";
import StartGameConfirmation from "@/components/modals/StartGameConfirmation";

import GameFilterBar from "./GameFilterBar";
import getGameTableColumns from "./GameTableColumns";

const GameTable = () => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState(null);
  const [filter, setFilter] = useState({
    search: "",
    status: GAME_STATUS_VALUES.SCHEDULED,
    type: GAME_TYPE_VALUES.NORMAL,
    sport: "all",
    league: "",
    season: "",
    start_date: "",
    end_date: "",
  });

  const { isLoading, isError, data: games } = useGames(filter);

  const modals = {
    delete: useModal(),
    update: useModal(),
    startingLineup: useModal(),
    startGame: useModal(),
  };

  if (isError) return <PageError />;

  const columns = getGameTableColumns({
    filterStatus: filter.status,
    navigate,
    setSelectedGame,
    modals,
  });

  return (
    <div className="px-5 md:border md:bg-muted/30 md:p-5 lg:p-8 my-5 rounded-lg">
      <GameFilterBar filter={filter} setFilter={setFilter} />
      <DataTable columns={columns} data={games || []} loading={isLoading} className="text-xs md:text-sm" />
      <UpdateGameModal isOpen={modals.update.isOpen} onClose={modals.update.closeModal} game={selectedGame} />
      <DeleteGameModal isOpen={modals.delete.isOpen} onClose={modals.delete.closeModal} game={selectedGame} />
      <StartingLineupModal isOpen={modals.startingLineup.isOpen} onClose={modals.startingLineup.closeModal} game={selectedGame} />
      <StartGameConfirmation isOpen={modals.startGame.isOpen} onClose={modals.startGame.closeModal} game={selectedGame} />
    </div>
  );
};

export default GameTable;
