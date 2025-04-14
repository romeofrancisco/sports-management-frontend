import React, { useState } from "react";
import LeaguesListHeader from "./components/league/LeaguesListHeader";
import { useLeagues } from "@/hooks/useLeagues";
import Loading from "@/components/common/Loading";
import PageError from "../PageError";
import { useModal } from "@/hooks/useModal";
import { Trash, MoreHorizontal, Settings, SquarePen } from "lucide-react";
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
import UpdateLeagueModal from "@/components/modals/UpdateLeagueModal";
import { useNavigate } from "react-router";

const LeagueActions = ({ league }) => {
  const [selectedLeague, setSelectedLeague] = useState(null)
  const { isOpen: isDeleteOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
  const { isOpen: isUpdateOpen, openModal: openUpdateModal, closeModal: closeUpdateModal } = useModal();

  const navigate = useNavigate();

  const handleDeleteLeague = () => {
    setSelectedLeague(league);
    openDeleteModal();
  };

  const handleUpdateLeague = () => {
    setSelectedLeague(league);
    openUpdateModal();
  };

  return (
    <>
      <DropdownMenu>
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
          <DropdownMenuItem onClick={() => navigate(`/leagues/${league.id}`)}>
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
      <UpdateLeagueModal
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

  if (isLoading) return <Loading />;
  if (isError) return <PageError />;

  return (
    <div>
      <LeaguesListHeader />
      <LeaguesContainer leagues={data} />
    </div>
  );
};

export default LeaguesList;
