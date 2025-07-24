import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useModal } from "@/hooks/useModal";
import {
  Trash,
  MoreHorizontal,
  Settings,
  SquarePen,
  Trophy,
  Eye,
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
import DeleteLeagueModal from "@/components/modals/DeleteLeagueModal";
import LeagueModal from "@/components/modals/LeagueModal";

const LeagueActions = ({ league, updateModal, deleteModal }) => {
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleDeleteLeague = () => {
    setSelectedLeague(league);
    deleteModal.openModal();
    setOpen(false);
  };

  const handleUpdateLeague = () => {
    setSelectedLeague(league);
    updateModal.openModal();
    setOpen(false);
  };

  const handleNavigate = (path) => {
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
            onClick={e => e.stopPropagation()}
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
            League Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-primary/20" />
          <DropdownMenuItem
            onClick={e => { e.stopPropagation(); handleNavigate(`/leagues/${league.id}`); }}
            className="hover:bg-secondary/10 focus:bg-secondary/10 cursor-pointer flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Manage League
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={e => { e.stopPropagation(); handleUpdateLeague(); }}
            className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer flex items-center gap-2"
          >
            <SquarePen className="h-4 w-4" />
            Edit League
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-destructive/20" />
          <DropdownMenuItem
            onClick={e => { e.stopPropagation(); handleDeleteLeague(); }}
            className="hover:bg-destructive/10 focus:bg-destructive/10 text-destructive cursor-pointer flex items-center gap-2"
          >
            <Trash className="h-4 w-4" />
            Delete League
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteLeagueModal
        onClose={deleteModal.closeModal}
        isOpen={deleteModal.isOpen}
        league={selectedLeague}
      />
      <LeagueModal
        onClose={updateModal.closeModal}
        isOpen={updateModal.isOpen}
        league={selectedLeague}
      />
    </>
  );
};

export default LeagueActions;
