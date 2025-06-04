import React, { useState } from "react";
import { useLeagues } from "@/hooks/useLeagues";
import Loading from "@/components/common/FullLoading";
import PageError from "@/pages/PageError";
import { useModal } from "@/hooks/useModal";
import { Trash, MoreHorizontal, Settings, SquarePen, Plus } from "lucide-react";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
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
import { useNavigate } from "react-router";

const LeagueActions = ({ league }) => {
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [open, setOpen] = useState(false);
  const { isOpen: isDeleteOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
  const { isOpen: isUpdateOpen, openModal: openUpdateModal, closeModal: closeUpdateModal } = useModal();

  const navigate = useNavigate();

  const handleDeleteLeague = () => {
    setSelectedLeague(league);
    openDeleteModal();
    setOpen(false); // Close the dropdown when opening the modal
  };

  const handleUpdateLeague = () => {
    setSelectedLeague(league);
    openUpdateModal();
    setOpen(false); // Close the dropdown when opening the modal
  };

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false); // Close the dropdown when navigating
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 absolute right-1 top-1"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleNavigate(`/leagues/${league.id}`)}>
            <Settings />
            Manage League
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleUpdateLeague()}>
            <SquarePen />
            Update League
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => handleDeleteLeague()}
          >
            <Trash />
            Delete League
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteLeagueModal
        onClose={closeDeleteModal}
        isOpen={isDeleteOpen}
        league={selectedLeague}
      />
      <LeagueModal
        onClose={closeUpdateModal}
        isOpen={isUpdateOpen}
        league={selectedLeague}
      />
    </>
  );
};

const LeaguesContainer = ({ leagues }) => {
  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mt-4 gap-4">
      {leagues.map((league) => (
        <div
          key={league.id}
          className="relative aspect-square rounded-xl border bg-muted/60"
        >
          <LeagueActions league={league} />
          <img
            src={league.logo}
            alt={league.name}
            className="object-cover rounded-xl"
          />
        </div>
      ))}
    </div>
  );
};

const LeaguesList = () => {
  const { data, isLoading, isError } = useLeagues();
  const { isOpen, closeModal, openModal } = useModal();

  if (isLoading) return <Loading />;
  if (isError) return <PageError />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="p-4 md:p-6 space-y-8">
        <UniversityPageHeader
          title="Leagues"
          subtitle="Administrative Portal"
          description="Create and manage sports leagues and competitions"
          buttonText="Create League"
          buttonIcon={Plus}
          onButtonClick={openModal}
          showUniversityColors={true}
        />
        
        <div className="animate-in fade-in-50 duration-500 delay-100">
          <LeaguesContainer leagues={data} />
        </div>
      </div>
      
      <LeagueModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
};

export default LeaguesList;
