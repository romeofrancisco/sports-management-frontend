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
    isOpen: isStartOpen,
    openModal: openStartModal,
    closeModal: closeStartModal,
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

  const handleStartGame = (game) => {
    setSelectedGame(game);
    openStartModal();
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
    },
    {
      id: "teams",
      header: "Teams",
      cell: ({ row }) => {
        const { home_team, away_team } = row.original;
        return (
          <div className="grid grid-cols-[auto_auto_auto_auto_auto] items-center gap-4 font-medium text-center max-w-[25rem]">
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
    },
    {
      id: "location",
      header: "Location",
      cell: ({ row }) => row.original.location,
    },
    {
      id: "time",
      header: "Time",
      cell: ({ row }) => formatTime(row.original.date),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const game = row.original;
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
              <DropdownMenuItem onClick={() => handleStartGame(game)}>
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
        isOpen={isStartOpen}
        onClose={closeStartModal}
        game={selectedGame}
      />
    </>
  );
};
