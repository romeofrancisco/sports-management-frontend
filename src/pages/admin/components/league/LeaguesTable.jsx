import { useModal } from "@/hooks/useModal";
import React, { useState } from "react";
import DataTable from "@/components/common/DataTable";
import {
    Trash,
    MoreHorizontal,
    ClipboardPenLine,
    SquarePen,
  } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"; 
import { formatShortDate } from "@/utils/formatDate";
import DeleteLeagueModal from "@/components/modals/DeleteLeagueModal";
import UpdateLeagueModal from "@/components/modals/UpdateLeagueModal";

const LeaguesTable = ({ leagues }) => {
  const [selectedLeague, setSelectedLeague] = useState(null);
  const { isOpen: isDeleteOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
  const { isOpen: isUpdateOpen, openModal: openUpdateModal, closeModal: closeUpdateModal } = useModal();
  const { isOpen: isStartOpen, openModal: openStartModal, closeModal: closeStartModal } = useModal();


  const handleDeleteLeague = (league) => {
    setSelectedLeague(league)
    openDeleteModal()
  }

  const handleUpdateLeague = (league) => {
    setSelectedLeague(league)
    openUpdateModal()
  }

  const columns = [
    {
        id: "name",
        header: "League",
        cell: ({ row }) => row.original.name
    },
    {
        id: "start_date",
        header: "Start Date",
        cell: ({ row }) => formatShortDate(row.original.start_date)
    },
    {
        id: "end_date",
        header: "End Date",
        cell: ({ row }) => formatShortDate(row.original.end_date)
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const league = row.original;
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
                <DropdownMenuItem onClick={() => handleStartLeague(league)}>
                    <ClipboardPenLine />
                    Start League
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateLeague(league)}>
                    <SquarePen />
                    Update League
                </DropdownMenuItem>
                <DropdownMenuItem
                    variant="destructive"
                    onClick={() => handleDeleteLeague(league)}
                >
                    <Trash />
                    Delete League
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            );
        },
    },
  ]

  return (
    <>
      <DataTable columns={columns} data={leagues} />
      <DeleteLeagueModal onClose={closeDeleteModal} isOpen={isDeleteOpen} league={selectedLeague} />
      <UpdateLeagueModal onClose={closeUpdateModal} isOpen={isUpdateOpen} league={selectedLeague}/>
    </>
  );
};

export default LeaguesTable;
