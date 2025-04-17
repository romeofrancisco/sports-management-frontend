import { useState } from "react";
import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trash, UserPen, UserSearch, MoreHorizontal } from "lucide-react";
import DataTable from "@/components/common/DataTable";
import PageError from "@/pages/PageError";
import DeletePlayerModal from "@/components/modals/DeletePlayerModal";
import UpdatePlayerModal from "@/components/modals/UpdatePlayerModal";
import { useModal } from "@/hooks/useModal";
import { usePlayers } from "@/hooks/usePlayers";
import { getCourseLabel, getYearLevelLabel } from "@/constants/player";
import PlayersFilterBar from "./PlayersFilterBar";

const getColumns = (navigate, handleUpdatePlayer, handleDeletePlayer) => [
  {
    id: "name",
    header: () => <h1 className="ps-3">Name</h1>,
    cell: ({ row }) => {
      const { profile, first_name, last_name } = row.original;
      return (
        <div className="flex gap-2 items-center ps-3">
          <Avatar>
            <AvatarImage src={profile} alt={first_name} />
            <AvatarFallback className="rounded-lg bg-accent">{first_name[0]}{last_name[0]}</AvatarFallback>
          </Avatar>
          <span>
            {first_name} {last_name}
          </span>
        </div>
      );
    },
    size: 200,
  },
  {
    id: "year_level",
    header: "Year Level",
    cell: ({ row }) => getYearLevelLabel(row.original.year_level),
    size: 150,
  },
  {
    id: "course",
    header: "Course",
    cell: ({ row }) => getCourseLabel(row.original.course),
    size: 100,
  },
  {
    id: "sport",
    header: "Sport",
    cell: ({ row }) => row.original.sport.name,
    size: 100,
  },
  {
    id: "position",
    header: "Position",
    cell: ({ row }) =>
      row.original.positions?.map((pos) => pos.abbreviation).join(", "),
    size: 70,
  },
  {
    id: "jersey_number",
    header: "Jersey #",
    cell: ({ row }) => row.original.jersey_number,
    size: 70,
  },
  {
    id: "team",
    header: "Team",
    cell: ({ row }) => row.original.team?.name,
    size: 100,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const player = row.original;
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
            <DropdownMenuItem
              onClick={() => navigate(`/players/${player.slug}`)}
            >
              <UserSearch />
              View Player
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUpdatePlayer(player)}>
              <UserPen />
              Update Player
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeletePlayer(player)}>
              <Trash />
              Delete Player
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 40,
  },
];

export const PlayersTable = () => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [filter, setFilter] = useState({
    search: "",
    sex: "male",
    sport: "all",
    year_level: "all",
    course: "all",
  });

  const { data: players, isLoading, isError } = usePlayers(filter);

  const { isOpen: isDeleteOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
  const { isOpen: isUpdateOpen, openModal: openUpdateModal, closeModal: closeUpdateModal } = useModal();

  const navigate = useNavigate();

  const handleDeletePlayer = (player) => {
    setSelectedPlayer(player);
    openDeleteModal();
  };

  const handleUpdatePlayer = (player) => {
    setSelectedPlayer(player);
    openUpdateModal();
  };

  if (isError) return <PageError />;

  const columns = getColumns(navigate, handleUpdatePlayer, handleDeletePlayer);

  return (
    <div className="border md:bg-muted/30 pt-5 md:p-5 lg:p-8 my-5 rounded-lg">
      <PlayersFilterBar filter={filter} setFilter={setFilter} />
      <DataTable columns={columns} data={players || []} loading={isLoading} className="text-xs md:text-sm"/>
      <DeletePlayerModal isOpen={isDeleteOpen} onClose={closeDeleteModal} player={selectedPlayer}/>
      <UpdatePlayerModal isOpen={isUpdateOpen} onClose={closeUpdateModal} player={selectedPlayer}/>
    </div>
  );
};
