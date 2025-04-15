import { useState } from "react";
import { useNavigate } from "react-router";
import { useModal } from "@/hooks/useModal";
import DataTable from "@/components/common/DataTable";
import PageError from "@/pages/PageError";
import { useGames } from "@/hooks/useGames";
import { GAME_STATUS_VALUES, GAME_TYPE_VALUES } from "@/constants/game";
import UpdateGameModal from "@/components/modals/UpdateGameModal";
import DeleteGameModal from "@/components/modals/DeleteGameModal";
import CreateStartingLineupModal from "@/components/modals/CreateStartingLineupModal";
import UpdateStartingLineupModal from "@/components/modals/UpdateStartingLineupModal";
import StartGameConfirmation from "@/components/modals/StartGameConfirmation";

import GameFilterBar from "./GameFilterBar";
import getGameTableColumns from "./GameTableColumns";


const GameTable = () => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState(null);
  const [filter, setFilter] = useState({
    status: GAME_STATUS_VALUES.SCHEDULED,
    type: GAME_TYPE_VALUES.NORMAL,
    league: "",
    season: "",
    start_date: "",
    end_date: "",
  });

  const {
    isLoading,
    isError,
    data: games,
  } = useGames(filter);

  const modals = {
    delete: useModal(),
    update: useModal(),
    registerLineup: useModal(),
    updateLineup: useModal(),
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
    <div className="border md:bg-muted/30 pt-5 md:p-5 lg:p-8 my-5 rounded-lg">
      <GameFilterBar filter={filter} setFilter={setFilter} />
      <DataTable columns={columns} data={games || []} loading={isLoading} className="text-xs md:text-sm" />
      <UpdateGameModal isOpen={modals.update.isOpen} onClose={modals.update.closeModal} game={selectedGame} />
      <DeleteGameModal isOpen={modals.delete.isOpen} onClose={modals.delete.closeModal} game={selectedGame} />
      <CreateStartingLineupModal isOpen={modals.registerLineup.isOpen} onClose={modals.registerLineup.closeModal} game={selectedGame} />
      <UpdateStartingLineupModal isOpen={modals.updateLineup.isOpen} onClose={modals.updateLineup.closeModal} game={selectedGame} />
      <StartGameConfirmation isOpen={modals.startGame.isOpen} onClose={modals.startGame.closeModal} game={selectedGame} />
    </div>
  );
};

export default GameTable;
