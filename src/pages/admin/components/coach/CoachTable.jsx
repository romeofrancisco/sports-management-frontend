import React, { useState } from "react";
import DataTable from "@/components/common/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarImage } from "@/components/ui/avatar";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { useModal } from "@/hooks/useModal";
import { Button } from "@/components/ui/button";
import { Trash, UserPen, UserSearch, MoreHorizontal } from "lucide-react";
import DeleteCoachModal from "@/components/modals/DeleteCoachModal";

const CoachTable = ({ coaches }) => {
  const [selectedCoach, setSelectedCoach] = useState(null);
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

  const handleDeleteCoach = (coach) => {
    setSelectedCoach(coach);
    openDeleteModal();
  };

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
              <AvatarFallback className="rounded-lg bg-accent">
                CN
              </AvatarFallback>
            </Avatar>
            <span>
              {first_name} {last_name}
            </span>
          </div>
        );
      },
    },
    {
      id: "team",
      header: () => <h1 className="ps-3">Team</h1>,
      cell: ({ row }) => {
        const teams = row.original.teams;
        return teams.length > 0
          ? teams.map((team) => team.name).join(" ,")
          : "--";
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const coach = row.original;

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
              <DropdownMenuItem>
                <UserSearch />
                View Coach
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateCoach(coach)}>
                <UserPen />
                Update Coach
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => handleDeleteCoach(coach)}
              >
                <Trash />
                Delete Coach
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <DataTable data={coaches} columns={columns} />
      <DeleteCoachModal
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
        coach={selectedCoach}
      />
    </>
  );
};

export default CoachTable;
