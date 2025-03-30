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
import { Trash, UserPen, UserSearch, MoreHorizontal } from "lucide-react";
import DataTable from "@/components/common/DataTable";
import { useModal } from "@/hooks/useModal";
import DeletePlayerModal from "@/components/modals/DeletePlayerModal";
import UpdatePlayerModal from "@/components/modals/UpdatePlayerModal";
import { AvatarImage } from "@/components/ui/avatar";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router";

export const PlayersTable = ({ players }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const { isOpen: isDeleteOpen, openModal: openDeleteModal, closeModal: closeDeleteModal} = useModal();
  const {isOpen: isUpdateOpen, openModal: openUpdateModal, closeModal: closeUpdateModal } = useModal();

  const navigate = useNavigate()

  const handleDeletePlayer = (player) => {
    setSelectedPlayer(player);
    openDeleteModal()
  };

  const handleUpdatePlayer = (player) => {
    setSelectedPlayer(player)
    openUpdateModal()
  }

  const columns = [
    {
      id: "name",
      header: () => <h1 className="ps-3">Name</h1>,
      cell: ({ row }) => {
        const { profile, first_name, last_name } = row.original;
        return (       
          <div className="flex gap-2 items-center ps-3">
            <Avatar>
              <AvatarImage src={profile} alt={first_name} />
              <AvatarFallback className="rounded-lg bg-accent">CN</AvatarFallback>
            </Avatar>
            <span>{first_name} {last_name}</span>
          </div>   

        );
      },
    },
    {
      id: "sport",
      header: "Sport",
      cell: ({ row }) => row.original.sport.name,
    },
    {
      id: "position",
      header: "Position",
      cell: ({ row }) => {
        const positions = row.original.positions;
        return positions?.map((pos) => pos.abbreviation).join(", ");
      },
    },
    {
      id: "jersey_number",
      header: "Jersey #",
      cell: ({ row }) => row.original.jersey_number,
    },
    {
      id: "team",
      header: "Team",
      cell: ({ row }) => {
        const { name } = row.original.team;
        return name;
      },
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
              <DropdownMenuItem onClick={() => navigate(`/players/${player.slug}`)}>
                <UserSearch />
                View Player
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdatePlayer(player)}>
                <UserPen />
                Update Player
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => handleDeletePlayer(player)}
              >
                <Trash />
                Delete Player
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={players} />
      <DeletePlayerModal
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
        player={selectedPlayer}
      />
      <UpdatePlayerModal
        isOpen={isUpdateOpen}
        onClose={closeUpdateModal}
        player={selectedPlayer}
      />
    </>
  );
};
