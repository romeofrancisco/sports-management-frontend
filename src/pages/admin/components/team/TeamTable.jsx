import React, { useState } from "react";
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
import DeleteTeamModal from "@/components/modals/DeleteTeamModal";
import UpdateTeamModal from "@/components/modals/UpdateTeamModal";
import { useNavigate } from "react-router";

const TeamTable = ({ teams }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const { isOpen: isDeleteOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
  const { isOpen: isUpdateOpen, openModal: openUpdateModal, closeModal: closeUpdateModal } = useModal();

  const navigate = useNavigate()

  const handleUpdateTeam = (team) => {
    setSelectedTeam(team);
    openUpdateModal()
  }

  const handleDeleteTeam = (team) => {
    setSelectedTeam(team);
    openDeleteModal();
  };

  const columns = [
    {
      id: "team",
      header: () => <h1 className="ps-3">Team</h1>,
      cell: ({ row }) => {
        const { logo, name } = row.original;
        return (
          <div className="flex items-center gap-2 ps-3 font-medium">
            <Avatar>
              <AvatarImage src={logo} alt={name} />
            </Avatar>
            {name}
          </div>
        );
      },
    },
    {
      id: "win",
      header: "W",
      cell: ({ row }) => row.original.record.win,
    },
    {
      id: "loss",
      header: "L",
      cell: ({ row }) => row.original.record.loss,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const team = row.original;
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
              <DropdownMenuItem onClick={() => navigate(`/teams/${team.slug}`)}>
                <ClipboardPenLine />
                View Team
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateTeam(team)}>
                <SquarePen />
                Update Team
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => handleDeleteTeam(team)}
              >
                <Trash />
                Delete Team
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ]; 
  
  return (
    <>
      <DataTable columns={columns} data={teams} />
      <DeleteTeamModal isOpen={isDeleteOpen} onClose={closeDeleteModal} team={selectedTeam} />
      <UpdateTeamModal isOpen={isUpdateOpen} onClose={closeUpdateModal} team={selectedTeam} />
    </>
  );
};

export default TeamTable;
