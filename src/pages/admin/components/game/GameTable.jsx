import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Trash,
  MoreHorizontal,
  ClipboardPenLine,
  SquarePen,
} from "lucide-react";
import DataTable from "@/components/common/DataTable";
import { useModal } from "@/hooks/useModal";
import { AvatarImage } from "@/components/ui/avatar";
import { Avatar } from "@/components/ui/avatar";
import { useNavigate } from "react-router";
import { formatShortDate, formatTime } from "@/utils/formatDate";
import UpdateGameModal from "@/components/modals/UpdateGameModal";
import DeleteGameModal from "@/components/modals/DeleteGameModal";
import CreateStartingLineupModal from "@/components/modals/CreateStartingLineupModal";
import UpdateStartingLineupModal from "@/components/modals/UpdateStartingLineupModal";
import { GAME_STATUS } from "@/constants/game";
import StartGameConfirmation from "@/components/modals/StartGameConfirmation";

export const GameTable = ({ games }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();
  const {
    isOpen: isUpdateOpen,
    openModal: openUpdateModal,
    closeModal: closeUpdateModal,
  } = useModal();
  const {
    isOpen: isRegisterLineupOpen,
    openModal: openRegisterLineupModal,
    closeModal: closeRegisterLineupModal,
  } = useModal();
  const {
    isOpen: isUpdateLineupOpen,
    openModal: openUpdateLineupModal,
    closeModal: closeUpdateLineupModal,
  } = useModal();
  const {
    isOpen: isStartGameOpen,
    openModal: openStartGameModal,
    closeModal: closeStartGameModal,
  } = useModal();

  const navigate = useNavigate();

  const handleUpdateGame = (game) => {
    setSelectedGame(game);
    openUpdateModal();
  };

  const handleDeleteGame = (game) => {
    setSelectedGame(game);
    openDeleteModal();
  };

  const handleRegisterStartingLineup = (game) => {
    setSelectedGame(game);
    openRegisterLineupModal();
  };

  const handleUpdateStartingLineup = (game) => {
    setSelectedGame(game);
    openUpdateLineupModal();
  };

  const handleStartGame = (game) => {
    setSelectedGame(game);
    openStartGameModal();
  };

  const columns = [
    {
      id: "date",
      header: () => <span className="ps-2 md:ps-5">Date</span>,
      cell: ({ row }) => (
        <span className="ps-2 md:ps-5">
          {formatShortDate(row.original.date)}
        </span>
      ),
      size: 100
    },
    {
      id: "teams",
      header: () => <h1 className="ms-10">Teams</h1>,
      cell: ({ row }) => {
        const { home_team, away_team } = row.original;
        return (
          <div className="grid grid-cols-5 items-center gap-4 font-medium text-center max-w-[25rem]">
            <Avatar className="place-self-end">
              <AvatarImage src={home_team.logo} />
            </Avatar>
            <span className="text-primary">{home_team.name}</span>
            <span className="text-muted-foreground font-bold">VS</span>
            <span className="text-secondary">{away_team.name}</span>
            <Avatar>
              <AvatarImage src={away_team.logo} />
            </Avatar>
          </div>
        );
      },
      size: 300
    },
    {
      id: "location",
      header: "Location",
      cell: ({ row }) => row.original.location ? row.original.location : "TBA",
      size: 300
    },
    {
      id: "time",
      header: () => "Time",
      cell: ({ row }) =>  formatTime(row.original.date),
      size: 100,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const game = row.original;
        const lineup = row.original.lineup_status;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {game.status !== GAME_STATUS.IN_PROGRESS && (
                <>
                  <DropdownMenuItem
                    onClick={() => handleRegisterStartingLineup(game)}
                    disabled={lineup.home_ready && lineup.away_ready}
                  >
                    <ClipboardPenLine />
                    Register Starting Lineup
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleUpdateStartingLineup(game)}
                    disabled={!lineup.home_ready && !lineup.away_ready}
                  >
                    <ClipboardPenLine />
                    Update Starting Lineup
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem
                onClick={() => handleStartGame(game)}
                disabled={!lineup.home_ready && !lineup.away_ready}
              >
                <ClipboardPenLine />
                Start Game
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateGame(game)}>
                <SquarePen />
                Update Game
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => handleDeleteGame(game)}
              >
                <Trash />
                Delete Game
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={games} />
      <UpdateGameModal
        isOpen={isUpdateOpen}
        onClose={closeUpdateModal}
        game={selectedGame}
      />
      <DeleteGameModal
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
        game={selectedGame}
      />
      <CreateStartingLineupModal
        isOpen={isRegisterLineupOpen}
        onClose={closeRegisterLineupModal}
        game={selectedGame}
      />
      <UpdateStartingLineupModal
        isOpen={isUpdateLineupOpen}
        onClose={closeUpdateLineupModal}
        game={selectedGame}
      />
      <StartGameConfirmation
        isOpen={isStartGameOpen}
        onClose={closeStartGameModal}
        game={selectedGame}
      />
    </>
  );
};
