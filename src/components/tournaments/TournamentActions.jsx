import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Trash,
  MoreHorizontal,
  Settings,
  SquarePen,
  Trophy,
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
import TournamentModal from "./TournamentModal";
import DeleteTournamentModal from "./DeleteTournamentModal";

const TournamentActions = ({
  tournament,
  updateModal,
  deleteModal,
  className,
}) => {
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleDeleteTournament = (e) => {
    if (e) e.stopPropagation();
    setSelectedTournament(tournament);
    // open parent modal state
    if (deleteModal && deleteModal.openModal) deleteModal.openModal();
    setOpen(false);
  };

  const handleUpdateTournament = (e) => {
    if (e) e.stopPropagation();
    setSelectedTournament(tournament);
    if (updateModal && updateModal.openModal) updateModal.openModal();
    setOpen(false);
  };

  const handleNavigate = (e, path) => {
    if (e) e.stopPropagation();
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 absolute right-4 top-0 z-10 bg-background/90 backdrop-blur-md border border-primary/20 hover:bg-primary/10 hover:border-primary/40 hover:scale-105 transition-all duration-300"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 bg-card/95 backdrop-blur-md border border-primary/20 shadow-xl"
        >
          <DropdownMenuLabel className="text-primary font-semibold flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Tournament Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-primary/20" />
          <DropdownMenuItem
            onClick={(e) => handleNavigate(e, `/tournaments/${tournament.id}`)}
            className="hover:bg-secondary/10 focus:bg-secondary/10 cursor-pointer flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Manage Tournament
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => handleUpdateTournament(e)}
            className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer flex items-center gap-2"
          >
            <SquarePen className="h-4 w-4" />
            Edit Tournament
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-destructive/20" />
          <DropdownMenuItem
            onClick={(e) => handleDeleteTournament(e)}
            className="hover:bg-destructive/10 focus:bg-destructive/10 text-destructive cursor-pointer flex items-center gap-2"
          >
            <Trash className="h-4 w-4" />
            Delete Tournament
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Delete Tournament Modal */}
      <DeleteTournamentModal
        open={deleteModal ? deleteModal.isOpen : false}
        onOpenChange={(v) => {
          if (!deleteModal) return;
          if (v) deleteModal.openModal();
          else deleteModal.closeModal();
        }}
        tournament={selectedTournament}
      />

      {/* Update Tournament Modal */}
      <TournamentModal
        open={updateModal ? updateModal.isOpen : false}
        onOpenChange={(v) => {
          if (!updateModal) return;
          if (v) updateModal.openModal();
          else updateModal.closeModal();
        }}
        tournament={selectedTournament}
      />
    </>
  );
};

export default TournamentActions;
